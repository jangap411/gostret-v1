import { useSelector, useDispatch } from 'react-redux';
import { toggleOnline } from '../../store/driverSlice';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { socketService } from '../../services/socket';
import { notificationService } from '../../services/localNotifications';
import MapView from '../../components/MapView';
import { motion, AnimatePresence } from 'framer-motion';

import { locationService } from '../../services/location';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

const DriverDashboard = ({
  earningsGrowth = "+12% vs LW",
  earningsData = [
    { day: 'M', active: false },
    { day: 'T', active: false },
    { day: 'W', active: true },
    { day: 'T', active: false },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ],
  onSOS,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const isOnline = useSelector((state) => state.driver.isOnline);
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [mapZoom, setMapZoom] = useState(13);

  const weeklyEarnings = user.wallet_balance || "1,284.50";

  const handleLocateMe = async () => {
    try {
      const position = await locationService.getCurrentPosition();
      setMapCenter([position.coords.latitude, position.coords.longitude]);
      setMapZoom(16);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  // Socket Integration
  useEffect(() => {
    if (isOnline) {
      socketService.joinDriversPool();
      
      socketService.onNewRide(async (ride) => {
        console.log("New ride received:", ride);
        await notificationService.scheduleRideRequest(ride);
        navigate('/driver/incoming-request', { state: { ride } });
      });
    }

    return () => {
      socketService.off('new_ride');
    };
  }, [isOnline, navigate]);

  const onToggleOnline = async () => {
    if (!isOnline) {
      await notificationService.requestPermissions();
    }
    dispatch(toggleOnline());
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="bg-background text-primary h-full relative overflow-hidden flex flex-col font-body"
    >
      {/* Full-Screen Map Background */}
      <MapView center={mapCenter} zoom={mapZoom} userImage={user?.avatar_url} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Subtle Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/10 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-900/10 to-transparent z-10 pointer-events-none"></div>

      {/* COMPACT TOP HEADER */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Compact Earnings Pill */}
          <motion.div 
            onClick={() => navigate('/earnings')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-surface px-4 py-2.5 rounded-2xl shadow-premium border border-white/40 flex flex-col gap-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-70">EARNINGS</span>
              <span className="text-[9px] font-black text-success uppercase tracking-tight">{earningsGrowth}</span>
            </div>
            <h2 className="text-xl font-black text-primary tracking-tighter leading-none">PGK {weeklyEarnings}</h2>
            
            {/* Minimal Day Track */}
            <div className="flex gap-1.5 mt-2">
              {earningsData.map((d, i) => (
                <div key={i} className={`size-1 rounded-full ${d.active ? 'bg-success shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`} />
              ))}
            </div>
          </motion.div>

          {/* Demo Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/driver/incoming-request', { 
              state: { 
                ride: {
                  id: 'test-123',
                  rider_name: "Test Rider",
                  rider_rating: "5.0",
                  fare: "25.00",
                  duration: "12 min",
                  pickup_address: "Vision City Mega Mall",
                  destination_address: "Jack's Paga Hill",
                  pickup_lat: -9.43869006941101,
                  pickup_lng: 147.1810054779053
                } 
              } 
            })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-surface text-primary shadow-sm border border-white/20 group w-fit"
          >
            <span className="material-symbols-outlined text-[14px] font-black text-accent group-hover:rotate-12 transition-transform">bolt</span>
            <span className="text-[9px] font-black tracking-widest uppercase">TEST</span>
          </motion.button>
        </div>

        {/* Online Status Toggle */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleOnline}
          className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-[24px] shadow-premium transition-all border-b-4 ${
            isOnline 
              ? 'bg-success text-white border-green-700' 
              : 'bg-slate-700 text-white border-slate-900'
          }`}
        >
          {isOnline && <span className="size-2 bg-white rounded-full block animate-pulse"></span>}
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </motion.button>
      </div>

      {/* COMPACT MAP CONTROLS */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-3">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onSOS}
          className="w-14 h-14 rounded-2xl bg-accent text-white shadow-premium flex items-center justify-center border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all">
          <span className="material-symbols-outlined font-black text-2xl">sos</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLocateMe}
          className="w-14 h-14 rounded-2xl glass-surface flex items-center justify-center text-primary shadow-premium border border-white/40 active:bg-white/60 transition-all">
          <span className="material-symbols-outlined text-xl font-black">my_location</span>
        </motion.button>
      </div>

      {/* COMPACT STATUS OVERLAYS */}
      <div className="absolute left-4 bottom-24 z-20 pointer-events-none flex flex-col gap-2">
        <div className="glass-surface px-3 py-2 rounded-xl border border-white/40 shadow-sm flex items-center gap-2 pointer-events-auto">
           <div className="size-1.5 bg-success rounded-full animate-ping"></div>
           <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">BUSY AREA</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DriverDashboard;
