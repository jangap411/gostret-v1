import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const location = useLocation();

  return (
    <div className="w-full max-w-md mx-auto min-h-screen shadow-2xl relative overflow-hidden bg-neutral-50">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/ride-details" element={<RideDetails />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/ride-in-progress" element={<RideInProgress />} />
          <Route path="/login" element={<Login />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/driver-en-route" element={<DriverEnRoute />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/search-location" element={<SearchLocation />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
