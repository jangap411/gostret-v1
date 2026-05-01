import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate,useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './components/Home';
import RideDetails from './components/RideDetails';
import PaymentMethods from './components/PaymentMethods';
import RideInProgress from './components/RideInProgress';
import Login from './components/Login';
import Activity from './components/Activity';
import DriverEnRoute from './components/DriverEnRoute';
import Signup from './components/Signup';
import Account from './components/Account';
import SearchLocation from './components/SearchLocation';
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';
import SearchingDriver from './components/SearchingDriver';
import SOSDialog from './components/SOSDialog';

import { useDispatch } from 'react-redux';
import { rideService } from './services/api';
import { setActiveRide } from './store/rideSlice';

import DriverDashboard from './pages/driver/DriverDashboard';
import ProfileEarnings from './pages/driver/ProfileEarnings';
import DriverAccounts from './pages/driver/DriverAccounts';
import ActiveTrip from './pages/driver/ActiveTrip';
import IncomingRequest from './pages/driver/IncomingRequest';
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import { socketService } from './services/socket';
import { notificationService } from './services/localNotifications';

import { useActiveRide } from './hooks/useRides';

function App() {
  const [loading, setLoading] = useState(true);
  const [isSOSDialogOpen, setIsSOSDialogOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: activeRide, isLoading: isRideLoading } = useActiveRide();

  useEffect(() => {
    // Initialize notifications
    notificationService.init();
    
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (token && isAuthenticated) {
      socketService.connect();
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (activeRide) {
      dispatch(setActiveRide(activeRide));
      socketService.joinRide(activeRide.id);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isDriver = user.role === 'driver';
      const currentPath = window.location.pathname;

      if (isDriver) {
        if (currentPath === '/' && (activeRide.status === 'accepted' || activeRide.status === 'in_progress')) {
          navigate('/driver/active-trip', { state: { ride: activeRide } });
        }
      } else {
        if (currentPath === '/' || currentPath === '/searching-driver') {
          if (activeRide.status === 'pending') navigate('/searching-driver');
          else if (activeRide.status === 'accepted') navigate('/driver-en-route');
          else if (activeRide.status === 'in_progress') navigate('/ride-in-progress');
        }
      }
    }
  }, [activeRide, dispatch]);


  if (loading) {
    return <SplashScreen />;
  }


  const hideBottomNavPaths = [
    '/login', 
    '/signup', 
    '/searching-driver', 
    '/search-location', 
    '/ride-details', 
    '/ride-in-progress',
    '/driver-en-route',
    '/driver/active-trip',
    '/driver/incoming-request'
  ];
  const showBottomNav = !hideBottomNavPaths.includes(location.pathname);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isDriver = user.role === 'driver';

  const triggerSOS = () => {
    setIsSOSDialogOpen(true);
  };

  const confirmSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          socketService.emitSOS({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            avatar: user.avatar_url,
            lat,
            lng,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.error("Error getting location for SOS:", error);
          socketService.emitSOS({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            avatar: user.avatar_url,
            lat: null,
            lng: null,
            timestamp: new Date().toISOString()
          });
        }
      );
    } else {
      socketService.emitSOS({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        avatar: user.avatar_url,
        lat: null,
        lng: null,
        timestamp: new Date().toISOString()
      });
    }
    
    // Open emergency number on phone app
    window.location.href = 'tel:111'; 
    setIsSOSDialogOpen(false);
  };

  const handleViewAllActivity = () => {
    navigate('/activity');
  };

  // Admin route: full-screen web view, outside the mobile shell
  if (location.pathname === '/admin') {
    return (
      <div className="w-full min-h-screen overflow-y-auto bg-slate-50">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col shadow-2xl relative overflow-hidden bg-neutral-50">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <ProtectedRoute>
                {isDriver ? (
                  <DriverDashboard 
                    onSOS={triggerSOS} 
                    onViewAllActivity={handleViewAllActivity} 
                  />
                ) : (
                  <Home onSOS={triggerSOS} />
                )}
              </ProtectedRoute>
            } />
            <Route path="/ride-details" element={<ProtectedRoute><RideDetails onSOS={triggerSOS} /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
            <Route path="/ride-in-progress" element={<ProtectedRoute><RideInProgress onSOS={triggerSOS} /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/driver-en-route" element={<ProtectedRoute><DriverEnRoute onSOS={triggerSOS} /></ProtectedRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<ProtectedRoute>{isDriver ? <DriverAccounts /> : <Account />}</ProtectedRoute>} />
            <Route path="/earnings" element={<ProtectedRoute><ProfileEarnings /></ProtectedRoute>} />
            <Route path="/driver/active-trip" element={<ProtectedRoute><ActiveTrip onSOS={triggerSOS} /></ProtectedRoute>} />
            <Route path="/driver/incoming-request" element={<ProtectedRoute><IncomingRequest onSOS={triggerSOS} /></ProtectedRoute>} />
            <Route path="/search-location" element={<ProtectedRoute><SearchLocation /></ProtectedRoute>} />
            <Route path="/searching-driver" element={<ProtectedRoute><SearchingDriver /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </div>
      {showBottomNav && <BottomNav />}
      
      <SOSDialog 
        isOpen={isSOSDialogOpen} 
        onClose={() => setIsSOSDialogOpen(false)} 
        onConfirm={confirmSOS} 
      />
    </div>
  );
}

export default App;
