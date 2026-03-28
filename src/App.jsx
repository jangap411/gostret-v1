import React from 'react';
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

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();

  return (
    <div className="w-full max-w-md mx-auto min-h-screen shadow-2xl relative overflow-hidden bg-neutral-50">
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
  );
}

export default App;
