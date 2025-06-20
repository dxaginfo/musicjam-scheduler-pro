# MusicJam Scheduler Pro

A comprehensive web application for automatically scheduling band rehearsals, sending reminders, tracking attendance, and suggesting optimal rehearsal times based on member availability.

## Features

### 🎵 For Band Leaders
- Create and manage band profiles
- View member availability at a glance
- Get automatic suggestions for optimal rehearsal times
- Track attendance and identify patterns
- Create and share rehearsal setlists

### 🎸 For Band Members
- Set recurring and one-time availability 
- Receive automatic rehearsal reminders
- Confirm attendance with one click
- Access rehearsal setlists and notes
- Track personal progress on songs

### 🏢 For Venue Managers
- Set available time slots for rehearsal spaces
- View all bookings in a calendar interface
- Manage multiple rehearsal rooms
- Track venue utilization and generate reports

## Technology Stack

### Frontend
- React.js with TypeScript
- Redux for state management
- Material-UI component library
- FullCalendar for scheduling interface
- Responsive design for all devices

### Backend
- Node.js with Express
- MongoDB database
- JWT authentication
- RESTful API design
- Real-time notifications with Socket.io

### DevOps
- Docker containers
- CI/CD with GitHub Actions
- AWS deployment
- Monitoring with Sentry

## System Architecture

The application follows a modern microservices architecture with the following components:

1. **Client Application**
   - Browser-based React application
   - Progressive Web App capabilities
   - Communicates with API Gateway

2. **API Gateway**
   - Handles authentication and request routing
   - Rate limiting and request validation
   - Routes requests to appropriate microservices

3. **Microservices**
   - User Service: Handles user authentication and profile management
   - Group Service: Manages bands, memberships, and permissions
   - Scheduling Service: Processes availability and creates optimal schedules
   - Notification Service: Manages reminder delivery across channels
   - Setlist Service: Handles song management and rehearsal content

4. **Data Layer**
   - MongoDB database cluster
   - Redis for caching and real-time features
   - S3 for media storage

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- Docker (optional for containerized development)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/musicjam-scheduler-pro.git
cd musicjam-scheduler-pro
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Environment Setup
```bash
# Copy example environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit the .env files with your configuration
```

4. Start the Development Servers
```bash
# Start the backend server
cd server
npm run dev

# In a separate terminal, start the frontend
cd client
npm start
```

5. Access the application at `http://localhost:3000`

### Docker Setup

Alternatively, you can use Docker Compose to run the entire stack:

```bash
docker-compose up -d
```

## Project Structure

```
musicjam-scheduler-pro/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Application entry point
│   └── package.json         # Frontend dependencies
│
├── server/                  # Backend Node.js application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Server entry point
│   └── package.json         # Backend dependencies
│
├── docker-compose.yml       # Docker composition
├── Dockerfile.client        # Frontend Docker config
├── Dockerfile.server        # Backend Docker config
└── README.md                # Project documentation
```

## API Documentation

The API documentation is available at `/api/docs` when running the server. It's generated using Swagger and provides interactive documentation for all available endpoints.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/dxaginfo/musicjam-scheduler-pro](https://github.com/dxaginfo/musicjam-scheduler-pro)

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Material-UI](https://material-ui.com/)
- [FullCalendar](https://fullcalendar.io/)