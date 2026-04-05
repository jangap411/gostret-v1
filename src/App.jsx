import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  const showBottomNav = !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col shadow-2xl relative overflow-hidden bg-neutral-50">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/ride-details" element={<ProtectedRoute><RideDetails /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
            <Route path="/ride-in-progress" element={<ProtectedRoute><RideInProgress /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/driver-en-route" element={<ProtectedRoute><DriverEnRoute /></ProtectedRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/search-location" element={<ProtectedRoute><SearchLocation /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default App;
