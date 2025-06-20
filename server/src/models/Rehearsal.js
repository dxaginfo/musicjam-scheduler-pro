const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Rehearsal:
 *       type: object
 *       required:
 *         - groupId
 *         - startDateTime
 *         - endDateTime
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         groupId:
 *           type: string
 *           description: Reference to the Group this rehearsal belongs to
 *         venueId:
 *           type: string
 *           description: Reference to the Venue where the rehearsal takes place
 *         title:
 *           type: string
 *           description: Title or name of the rehearsal
 *         description:
 *           type: string
 *           description: Detailed description of the rehearsal
 *         startDateTime:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the rehearsal
 *         endDateTime:
 *           type: string
 *           format: date-time
 *           description: End date and time of the rehearsal
 *         isRecurring:
 *           type: boolean
 *           description: Whether this is a recurring rehearsal
 *         recurringPattern:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               enum: [weekly, biweekly, monthly]
 *               description: How often the rehearsal repeats
 *             dayOfWeek:
 *               type: number
 *               description: Day of week (0-6, starting with Sunday)
 *             interval:
 *               type: number
 *               description: Interval between occurrences
 *             endDate:
 *               type: string
 *               format: date
 *               description: When the recurring pattern ends
 *         setlistId:
 *           type: string
 *           description: Reference to the Setlist for this rehearsal
 *         attendees:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Reference to a User
 *               status:
 *                 type: string
 *                 enum: [confirmed, declined, pending]
 *                 description: Attendance status
 *               responseTime:
 *                 type: string
 *                 format: date-time
 *                 description: When the user responded
 *         notes:
 *           type: string
 *           description: Additional notes for the rehearsal
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Rehearsal creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Rehearsal last update timestamp
 */

const RecurringPatternSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    required: true
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    required: function() {
      return this.frequency === 'weekly' || this.frequency === 'biweekly';
    }
  },
  interval: {
    type: Number,
    min: 1,
    default: 1
  },
  endDate: {
    type: Date,
    required: true
  }
}, { _id: false });

const AttendeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'declined', 'pending'],
    default: 'pending'
  },
  responseTime: {
    type: Date
  }
}, { _id: false });

const RehearsalSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  startDateTime: {
    type: Date,
    required: [true, 'Please provide a start date and time']
  },
  endDateTime: {
    type: Date,
    required: [true, 'Please provide an end date and time'],
    validate: {
      validator: function(value) {
        return value > this.startDateTime;
      },
      message: 'End time must be after start time'
    }
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: RecurringPatternSchema,
    required: function() {
      return this.isRecurring;
    }
  },
  setlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Setlist'
  },
  attendees: {
    type: [AttendeeSchema],
    default: []
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create index for efficient queries
RehearsalSchema.index({ groupId: 1, startDateTime: 1 });
RehearsalSchema.index({ venueId: 1, startDateTime: 1 });

// Virtual for duration in minutes
RehearsalSchema.virtual('durationMinutes').get(function() {
  return Math.round((this.endDateTime - this.startDateTime) / (1000 * 60));
});

// Virtual for attendance statistics
RehearsalSchema.virtual('attendanceStats').get(function() {
  const stats = {
    confirmed: 0,
    declined: 0,
    pending: 0,
    total: this.attendees.length
  };
  
  this.attendees.forEach(attendee => {
    stats[attendee.status]++;
  });
  
  return stats;
});

// Method to check for scheduling conflicts with existing rehearsals
RehearsalSchema.statics.checkForConflicts = async function(venueId, startDateTime, endDateTime, excludeId = null) {
  if (!venueId) return false;
  
  const query = {
    venueId,
    $or: [
      { 
        startDateTime: { $lt: endDateTime },
        endDateTime: { $gt: startDateTime }
      }
    ]
  };
  
  // Exclude the current rehearsal when checking for conflicts during updates
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

// Method to get all rehearsals for a member
RehearsalSchema.statics.getForMember = async function(userId, options = {}) {
  const { startDate, endDate, status, limit = 10, skip = 0 } = options;
  
  const query = {
    'attendees.userId': userId
  };
  
  if (startDate) {
    query.startDateTime = { $gte: startDate };
  }
  
  if (endDate) {
    query.endDateTime = { $lte: endDate };
  }
  
  if (status) {
    query['attendees.status'] = status;
  }
  
  return this.find(query)
    .sort({ startDateTime: 1 })
    .limit(limit)
    .skip(skip)
    .populate('groupId', 'name')
    .populate('venueId', 'name address')
    .populate('setlistId', 'name');
};

// Method to add an attendee to the rehearsal
RehearsalSchema.methods.addAttendee = function(userId, status = 'pending') {
  // Check if user is already an attendee
  const existingIndex = this.attendees.findIndex(
    attendee => attendee.userId.toString() === userId.toString()
  );
  
  if (existingIndex >= 0) {
    // Update existing attendee
    this.attendees[existingIndex].status = status;
    this.attendees[existingIndex].responseTime = new Date();
  } else {
    // Add new attendee
    this.attendees.push({
      userId,
      status,
      responseTime: status !== 'pending' ? new Date() : undefined
    });
  }
  
  return this;
};

// Method to update an attendee's status
RehearsalSchema.methods.updateAttendeeStatus = function(userId, status) {
  // Find the attendee
  const attendee = this.attendees.find(
    a => a.userId.toString() === userId.toString()
  );
  
  if (!attendee) {
    return false;
  }
  
  // Update the status
  attendee.status = status;
  attendee.responseTime = new Date();
  
  return true;
};

module.exports = mongoose.model('Rehearsal', RehearsalSchema);