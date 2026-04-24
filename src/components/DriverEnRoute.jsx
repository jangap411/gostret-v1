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
      className="relative flex size-full h-full flex-col bg-base overflow-hidden font-body"
    >
      {/* Background Map */}
      <div className="absolute inset-0 z-0 opacity-40 grayscale contrast-125">
        <MapView 
            center={activeRide?.pickup_lat ? [activeRide.pickup_lat, activeRide.pickup_lng] : null} 
            driverLocation={driverLocation}
            zoom={15} 
            className="w-full h-full" 
        />
      </div>
      
      {/* Subtle Map Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent z-[1] pointer-events-none"></div>

      {/* COMPACT TOP STATUS */}
      <div className="absolute top-8 left-6 right-6 z-20">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-surface-container/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-premium border border-white/5 flex items-center gap-4"
        >
           <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <span className="material-symbols-outlined text-[20px] font-black shadow-glow">check_circle</span>
              <span className="absolute inset-0 size-full bg-primary/20 rounded-full animate-ping shadow-teal-glow"></span>
           </div>
           <div className="flex flex-col">
              <h3 className="text-on-surface text-[14px] font-black tracking-tight leading-none uppercase">Driver is en route</h3>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1.5">Approaching Pickup</p>
           </div>
        </motion.div>
      </div>

      {/* COMPACT MODERN DRIVER CARD - BOTTOM */}
      <div className="mt-auto relative z-20 p-6 pb-10">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface-container p-6 rounded-[40px] shadow-2xl border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-30" />
          
          <div className="flex items-center gap-5 relative z-10 w-full overflow-hidden">
            {/* Left: Avatar */}
            <div className="relative shrink-0">
              <div className="size-16 rounded-3xl overflow-hidden border-4 border-base shadow-premium bg-surface-bright">
                <img 
                  src={activeRide?.driver_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeRide?.driver_name || 'Driver')}&background=1C1B1B&color=46F1C5&bold=true`} 
                  alt="Driver" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-primary border-4 border-base rounded-xl shadow-glow"></div>
            </div>

            {/* Center: Info */}
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              <h4 className="text-on-surface text-xl font-black tracking-tighter leading-none truncate">{activeRide?.driver_name || 'Your Driver'}</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/10 shrink-0">
                  <span className="text-primary text-[10px] material-symbols-outlined font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-[11px] font-black text-on-surface">4.9</span>
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant truncate tracking-tight uppercase opacity-60">Toyota Corolla</span>
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex gap-3 shrink-0">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface shadow-premium border border-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined font-black text-xl">call</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-12 rounded-2xl teal-pulse-gradient flex items-center justify-center text-base shadow-teal-glow"
              >
                <span className="material-symbols-outlined font-black text-xl">chat_bubble</span>
              </motion.button>
            </div>
          </div>

          {/* Subtitle / Progress */}
          <div className="flex items-center justify-between gap-6 pt-6">
             <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 10, ease: "easeOut" }}
                  className="h-full bg-primary shadow-teal-glow rounded-full"
                />
             </div>
             <span className="text-[10px] font-black text-on-surface-variant tracking-[0.3em] uppercase opacity-40 whitespace-nowrap">Meeting At Pickup</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
