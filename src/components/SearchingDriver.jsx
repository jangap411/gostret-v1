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
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userImage = user?.avatar_url;

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
        // Merge real driver data (name, avatar) from the socket event
        const updatedRide = { ...activeRide, ...data };
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
      className="relative flex size-full h-full flex-col bg-base overflow-hidden font-body"
    >
      {/* Background Map with Depth */}
      <div className="absolute inset-0 z-0">
        <MapView center={pickup?.marker?.position} zoom={15} userImage={userImage} className="w-full h-full opacity-20 grayscale contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-b from-base/20 via-base/80 to-base z-[1]"></div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
        
        {/* Advanced Pulsating Search Visual */}
        <div className="relative flex items-center justify-center mb-16">
            <motion.div 
                animate={{ scale: [1, 2.5, 3.5], opacity: [0.3, 0.1, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
                className="absolute size-32 bg-primary/10 rounded-full shadow-teal-glow"
            />
            <motion.div 
                animate={{ scale: [1, 2, 3], opacity: [0.2, 0.05, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeOut", delay: 1 }}
                className="absolute size-32 bg-primary/20 rounded-full"
            />
            
            <div className="relative size-32 bg-surface-container rounded-[40px] shadow-2xl flex items-center justify-center border border-white/5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-r-2 border-transparent border-t-primary border-r-primary/20 rounded-[40px]"
                />
                <div className="size-20 bg-primary/5 rounded-3xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl font-black animate-pulse shadow-glow">radar</span>
                </div>
            </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-12">
            <h2 className="text-on-surface text-3xl font-black tracking-tighter mb-4 uppercase">Connecting...</h2>
            <p className="text-on-surface-variant font-medium text-sm tracking-tight opacity-70 leading-relaxed max-w-[260px] mx-auto">
              Scanning for the best nearby <span className="text-primary font-bold">GoStret</span> partners to fulfill your request.
            </p>
        </div>

        {/* Progress Visualization */}
        <div className="w-full max-w-[300px]">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary shadow-teal-glow rounded-full relative z-10"
                />
            </div>
            <div className="mt-5 flex justify-between items-center text-[10px] font-black text-on-surface-variant tracking-[0.3em] uppercase opacity-60">
                <span className="flex items-center gap-2">
                  <div className="size-1.5 bg-primary rounded-full animate-pulse shadow-glow"></div>
                  {progress < 40 ? 'SCANNING' : progress < 80 ? 'LOCATING' : 'LINKING'}
                </span>
                <span className="text-primary">{progress}%</span>
            </div>
        </div>
        
        {/* Cancel Button */}
        <div className="mt-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            disabled={cancelling}
            className={`h-14 px-10 rounded-pill border border-white/10 text-on-surface-variant font-black text-xs tracking-[0.3em] uppercase hover:bg-white/5 transition-all ${cancelling ? 'opacity-50' : ''}`}
          >
            {cancelling ? 'Aborting...' : 'Cancel Request'}
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
}
