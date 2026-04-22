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
        {/* Map Gradient Overlays */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
      </div>

      {/* Floating Status Bar - TOP */}
      <div className="absolute top-6 left-4 right-4 z-20">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-surface px-6 py-4 rounded-[28px] shadow-premium border border-white/40 flex items-center gap-4"
        >
           <div className="size-11 rounded-full bg-success/10 flex items-center justify-center text-success relative">
              <span className="material-symbols-outlined font-black">check_circle</span>
              <span className="absolute inset-0 size-full bg-success/20 rounded-full animate-ping"></span>
           </div>
           <div className="flex flex-col">
              <h3 className="text-primary text-[15px] font-black tracking-tight leading-tight uppercase">Driver is en route</h3>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest opacity-80 mt-1">Arriving in approx. 3 mins</p>
           </div>
        </motion.div>
      </div>

      {/* Driver Identity Card - BOTTOM */}
      <div className="mt-auto relative z-20 p-4 pb-8">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface p-7 rounded-[40px] shadow-premium space-y-8 border border-white/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="size-16 rounded-[24px] overflow-hidden border-4 border-slate-50 shadow-sm relative group bg-slate-100">
                  <img 
                    src={activeRide?.driver_avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"} 
                    alt="Driver" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 size-6 bg-success border-4 border-white rounded-xl shadow-sm"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-primary text-xl font-black tracking-tighter leading-none">{activeRide?.driver_name || 'James K.'}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-lg border border-yellow-400/10">
                    <span className="text-yellow-500 text-[10px]">★</span>
                    <span className="text-[10px] font-black text-primary">4.9</span>
                  </div>
                  <span className="text-slate-300 font-bold">·</span>
                  <span className="text-[11px] font-bold text-slate-400 truncate tracking-tight uppercase">Toyota Corolla (PNG 123)</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shadow-sm hover:bg-slate-100 transition border border-border-subtle"
              >
                <span className="material-symbols-outlined font-black">call</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-premium transition border-b-4 border-accent-hover"
              >
                <span className="material-symbols-outlined font-black">chat_bubble</span>
              </motion.button>
            </div>
          </div>

          {/* Action Hint */}
          <div className="pt-2">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-1/3 h-full bg-success/40 rounded-full"
               />
            </div>
            <p className="text-center text-[9px] font-black text-slate-400 tracking-[0.25em] uppercase mt-3 opacity-60">Meeting at pickup point</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
