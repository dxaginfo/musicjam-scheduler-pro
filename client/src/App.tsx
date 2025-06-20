import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Availability from './pages/Availability';

// Group pages
import Groups from './pages/groups/Groups';
import GroupDetails from './pages/groups/GroupDetails';
import CreateGroup from './pages/groups/CreateGroup';
import EditGroup from './pages/groups/EditGroup';

// Rehearsal pages
import Rehearsals from './pages/rehearsals/Rehearsals';
import RehearsalDetails from './pages/rehearsals/RehearsalDetails';
import CreateRehearsal from './pages/rehearsals/CreateRehearsal';
import EditRehearsal from './pages/rehearsals/EditRehearsal';

// Venue pages
import Venues from './pages/venues/Venues';
import VenueDetails from './pages/venues/VenueDetails';
import CreateVenue from './pages/venues/CreateVenue';
import EditVenue from './pages/venues/EditVenue';

// Setlist pages
import Setlists from './pages/setlists/Setlists';
import SetlistDetails from './pages/setlists/SetlistDetails';
import CreateSetlist from './pages/setlists/CreateSetlist';
import EditSetlist from './pages/setlists/EditSetlist';

// Error pages
import NotFound from './pages/errors/NotFound';

// Define theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SocketProvider>
            <Router>
              <ToastContainer position="top-right" autoClose={5000} />
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  {/* Dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/availability" element={<Availability />} />
                  
                  {/* Groups */}
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/create" element={<CreateGroup />} />
                  <Route path="/groups/:id" element={<GroupDetails />} />
                  <Route path="/groups/:id/edit" element={<EditGroup />} />
                  
                  {/* Rehearsals */}
                  <Route path="/rehearsals" element={<Rehearsals />} />
                  <Route path="/rehearsals/create" element={<CreateRehearsal />} />
                  <Route path="/rehearsals/:id" element={<RehearsalDetails />} />
                  <Route path="/rehearsals/:id/edit" element={<EditRehearsal />} />
                  
                  {/* Venues */}
                  <Route path="/venues" element={<Venues />} />
                  <Route path="/venues/create" element={<CreateVenue />} />
                  <Route path="/venues/:id" element={<VenueDetails />} />
                  <Route path="/venues/:id/edit" element={<EditVenue />} />
                  
                  {/* Setlists */}
                  <Route path="/setlists" element={<Setlists />} />
                  <Route path="/setlists/create" element={<CreateSetlist />} />
                  <Route path="/setlists/:id" element={<SetlistDetails />} />
                  <Route path="/setlists/:id/edit" element={<EditSetlist />} />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;