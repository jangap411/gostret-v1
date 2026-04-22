import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { useSelector, useDispatch } from 'react-redux';
import { rideService } from '../services/api';
import { setActiveRide, clearRide } from '../store/rideSlice';
import { socketService } from '../services/socket';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function SearchingDriver() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const pickup = useSelector((state) => state.ride.pickup);
  const { activeRide } = useSelector((state) => state.ride);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 200);

    if (!activeRide) {
      navigate('/');
      return;
    }

    socketService.joinRide(activeRide.id);

    socketService.onStatusUpdate((data) => {
      if (data.status === 'accepted') {
        const updatedRide = { ...activeRide, status: 'accepted' };
        dispatch(setActiveRide(updatedRide));
        clearInterval(progressTimer);
        navigate('/driver-en-route');
      } else if (data.status === 'cancelled') {
        dispatch(clearRide());
        navigate('/');
      }
    });

    return () => {
      clearInterval(progressTimer);
      socketService.off('status_update');
    };
  }, [activeRide, navigate, dispatch]);

  const handleCancel = async () => {
    if (!activeRide?.id) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await rideService.updateRideStatus(activeRide.id, 'cancelled', token);
      dispatch(clearRide());
      navigate('/');
    } catch (error) {
      console.error("Cancellation failed", error);
      alert("Failed to cancel ride.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="relative flex size-full h-full flex-col bg-background overflow-hidden font-body"
    >
      {/* Background Map with Depth */}
      <div className="absolute inset-0 z-0">
        <MapView center={pickup?.marker?.position} zoom={15} className="w-full h-full opacity-30 blur-[4px] grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-[1]"></div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
        
        {/* Advanced Pulsating Search Visual */}
        <div className="relative flex items-center justify-center mb-16">
            <motion.div 
                animate={{ scale: [1, 2.5, 3.5], opacity: [0.4, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
                className="absolute size-32 bg-accent/10 rounded-full"
            />
            <motion.div 
                animate={{ scale: [1, 2, 3], opacity: [0.3, 0.1, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeOut", delay: 1 }}
                className="absolute size-32 bg-accent/20 rounded-full"
            />
            
            <div className="relative size-32 bg-surface rounded-[40px] shadow-premium flex items-center justify-center border border-white/20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 border-t-4 border-r-4 border-transparent border-t-accent border-r-accent/30 rounded-[40px]"
                />
                <div className="size-20 bg-accent/5 rounded-[28px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-accent text-4xl font-black animate-pulse">radar</span>
                </div>
            </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-12">
            <h2 className="text-primary text-3xl font-black tracking-tighter mb-3 uppercase">Connecting...</h2>
            <p className="text-slate-500 font-bold text-sm tracking-tight opacity-80 leading-relaxed max-w-[260px] mx-auto">
              Scanning for the best nearby <span className="text-accent">GoStret</span> partners to fulfill your request.
            </p>
        </div>

        {/* Progress Visualization */}
        <div className="w-full max-w-[300px]">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50 relative">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-accent shadow-[0_0_15px_rgba(217,72,62,0.4)] rounded-full relative z-10"
                />
                <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20"
                />
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                <span className="flex items-center gap-2">
                  <div className="size-1.5 bg-success rounded-full animate-pulse"></div>
                  {progress < 40 ? 'SCANNING' : progress < 80 ? 'LOCATING' : 'LINKING'}
                </span>
                <span className="text-primary">{progress}%</span>
            </div>
        </div>
        
        {/* Cancel Button - Tactile and Refined */}
        <div className="mt-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            disabled={cancelling}
            className={`h-14 px-10 rounded-2xl border-2 border-border-subtle text-slate-500 font-black text-xs tracking-[0.2em] uppercase hover:bg-slate-50 hover:text-primary transition-all shadow-sm ${cancelling ? 'opacity-50' : ''}`}
          >
            {cancelling ? 'ABORTING...' : 'CANCEL REQUEST'}
          </motion.button>
        </div>
      </div>

      {/* Tip Card - Premium Glassmorphism
      <div className="mt-auto p-8 z-20">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-surface p-6 rounded-[32px] shadow-premium flex items-center gap-5 border border-white/40"
        >
            <div className="size-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl">⚡️</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">PRO TIP</p>
                <p className="text-primary text-sm font-bold leading-snug tracking-tight">Drivers prefer exact pin locations. It helps them find you faster!</p>
            </div>
        </motion.div>
      </div> */}

    </motion.div>
  );
}
