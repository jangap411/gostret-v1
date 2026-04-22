import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MapView from './MapView';
import { setActiveRide } from '../store/rideSlice';
import { socketService } from '../services/socket';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function DriverEnRoute() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeRide } = useSelector((state) => state.ride);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    if (!activeRide) {
      navigate('/');
      return;
    }

    socketService.joinRide(activeRide.id);

    socketService.onStatusUpdate((data) => {
      if (data.status === 'in_progress') {
        const updatedRide = { ...activeRide, status: 'in_progress' };
        dispatch(setActiveRide(updatedRide));
        navigate('/ride-in-progress');
      }
    });

    socketService.onLocationUpdate((data) => {
      setDriverLocation(data);
    });

    return () => {
      socketService.off('status_update');
      socketService.off('location_update');
    };
  }, [activeRide, navigate, dispatch]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="relative flex size-full h-full flex-col bg-background overflow-hidden font-body"
    >
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapView 
            center={activeRide?.pickup_lat ? [activeRide.pickup_lat, activeRide.pickup_lng] : null} 
            driverLocation={driverLocation}
            zoom={15} 
            className="w-full h-full" 
        />
        {/* Subtle Map Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
      </div>

      {/* COMPACT TOP STATUS */}
      <div className="absolute top-6 left-4 right-4 z-20">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-surface px-5 py-3 rounded-2xl shadow-premium border border-white/40 flex items-center gap-3.5"
        >
           <div className="size-9 rounded-full bg-success/10 flex items-center justify-center text-success relative">
              <span className="material-symbols-outlined text-[20px] font-black">check_circle</span>
              <span className="absolute inset-0 size-full bg-success/20 rounded-full animate-ping"></span>
           </div>
           <div className="flex flex-col">
              <h3 className="text-primary text-[13px] font-black tracking-tight leading-none uppercase">Driver is en route</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Approx. 3 mins</p>
           </div>
        </motion.div>
      </div>

      {/* COMPACT MODERN DRIVER CARD - BOTTOM */}
      <div className="mt-auto relative z-20 p-4 pb-6">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface p-5 rounded-[32px] shadow-premium space-y-6 border border-white/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl opacity-50" />
          
          <div className="flex items-center gap-4 relative z-10 w-full overflow-hidden">
            {/* Left: Avatar */}
            <div className="relative shrink-0">
              <div className="size-14 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm bg-slate-100">
                <img 
                  src={activeRide?.driver_avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"} 
                  alt="Driver" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-success border-2 border-white rounded-lg shadow-sm"></div>
            </div>

            {/* Center: Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <h4 className="text-primary text-lg font-black tracking-tighter leading-none truncate">{activeRide?.driver_name || 'James K.'}</h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 py-0.5 rounded-lg border border-yellow-400/10 shrink-0">
                  <span className="text-yellow-500 text-[10px]">★</span>
                  <span className="text-[10px] font-black text-primary">4.9</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 truncate tracking-tight uppercase opacity-80">{activeRide?.vehicle_model || 'Toyota Corolla'}</span>
              </div>
            </div>
            
            {/* Right: Actions (Fixed Visibility) */}
            <div className="flex gap-2 shrink-0 pr-1">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-border-subtle"
              >
                <span className="material-symbols-outlined font-black text-xl">call</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-premium border-b-2 border-accent-hover"
              >
                <span className="material-symbols-outlined font-black text-xl">chat_bubble</span>
              </motion.button>
            </div>
          </div>

          {/* Subtitle / Progress */}
          <div className="flex items-center justify-between gap-4 pt-1">
             <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 10, ease: "easeOut" }}
                  className="h-full bg-success/40 rounded-full"
                />
             </div>
             <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase opacity-60 whitespace-nowrap">MEETING AT PICKUP</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
