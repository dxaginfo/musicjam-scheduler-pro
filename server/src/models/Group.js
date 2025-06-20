const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - name
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Group/band name
 *         description:
 *           type: string
 *           description: Group description or information
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Music genres the group performs
 *         coverImage:
 *           type: string
 *           description: URL to the group's cover image
 *         createdBy:
 *           type: string
 *           description: Reference to the User who created the group
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Reference to a User
 *               role:
 *                 type: string
 *                 enum: [member, admin, owner]
 *                 description: User's role in the group
 *               instruments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Instruments this member plays in the group
 *               joinedAt:
 *                 type: string
 *                 format: date-time
 *                 description: When the member joined the group
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Group creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Group last update timestamp
 */

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'owner'],
    default: 'member'
  },
  instruments: {
    type: [String],
    default: []
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a group name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  genre: {
    type: [String],
    default: []
  },
  coverImage: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: [MemberSchema],
    default: []
  }
}, {
  timestamps: true
});

// Add the creator as the owner when a new group is created
GroupSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Only add creator as owner if they're not already in the members array
    const isCreatorInMembers = this.members.some(
      member => member.userId.toString() === this.createdBy.toString()
    );
    
    if (!isCreatorInMembers) {
      this.members.push({
        userId: this.createdBy,
        role: 'owner',
        joinedAt: Date.now()
      });
    }
  }
  next();
});

// Virtual to get the count of members
GroupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to check if a user is a member of the group
GroupSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.userId.toString() === userId.toString());
};

// Method to check if a user is an admin of the group
GroupSchema.methods.isAdmin = function(userId) {
  return this.members.some(
    member => 
      member.userId.toString() === userId.toString() && 
      (member.role === 'admin' || member.role === 'owner')
  );
};

// Method to check if a user is the owner of the group
GroupSchema.methods.isOwner = function(userId) {
  return this.members.some(
    member => 
      member.userId.toString() === userId.toString() && 
      member.role === 'owner'
  );
};

// Method to add a member to the group
GroupSchema.methods.addMember = function(userId, role = 'member', instruments = []) {
  // Check if user is already a member
  if (this.isMember(userId)) {
    return false;
  }
  
  // Add the member
  this.members.push({
    userId,
    role,
    instruments,
    joinedAt: Date.now()
  });
  
  return true;
};

// Method to remove a member from the group
GroupSchema.methods.removeMember = function(userId) {
  // Check if user is a member
  if (!this.isMember(userId)) {
    return false;
  }
  
  // Prevent removing the owner
  if (this.isOwner(userId)) {
    return false;
  }
  
  // Remove the member
  this.members = this.members.filter(
    member => member.userId.toString() !== userId.toString()
  );
  
  return true;
};

// Method to update a member's role
GroupSchema.methods.updateMemberRole = function(userId, newRole) {
  // Check if user is a member
  if (!this.isMember(userId)) {
    return false;
  }
  
  // Prevent changing the role of the owner
  if (this.isOwner(userId) && newRole !== 'owner') {
    return false;
  }
  
  // Update the member's role
  this.members = this.members.map(member => {
    if (member.userId.toString() === userId.toString()) {
      member.role = newRole;
    }
    return member;
  });
  
  return true;
};

module.exports = mongoose.model('Group', GroupSchema);