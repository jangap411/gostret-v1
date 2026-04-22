import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MapView from './MapView';
import { clearRide, updateRideStatus } from '../store/rideSlice';
import { socketService } from '../services/socket';
import { reviewService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function RideInProgress() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeRide } = useSelector((state) => state.ride);
  const [driverLocation, setDriverLocation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!activeRide) {
      navigate('/');
      return;
    }

    socketService.joinRide(activeRide.id);

    socketService.onStatusUpdate((data) => {
      dispatch(updateRideStatus(data));
      if (data.status === 'completed') {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowReview(true);
        }, 3000);
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

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (token && activeRide?.driver_id) {
        await reviewService.addReview({
          ride_id: activeRide.id,
          reviewee_id: activeRide.driver_id,
          rating,
          comment
        }, token);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      dispatch(clearRide());
      navigate('/activity');
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
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView 
            center={driverLocation ? [driverLocation.lat, driverLocation.lng] : (activeRide ? [activeRide.pickup_lat, activeRide.pickup_lng] : null)}
            driverLocation={driverLocation}
            destination={activeRide ? [activeRide.destination_lat, activeRide.destination_lng] : null}
            zoom={15} 
            className="w-full h-full" 
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
      </div>

      {/* Premium Sticky Header - RIDE STATUS */}
      <div className="absolute top-6 left-4 right-4 z-20">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-surface p-5 rounded-[28px] shadow-premium border border-white/40 flex items-center justify-between"
        >
           <div className="flex items-center gap-4">
              <div className="size-11 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined font-black">schedule</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5 opacity-80">EN ROUTE</h3>
                <p className="text-primary text-base font-black tracking-tighter leading-none">Arriving in approx. 12 mins</p>
              </div>
           </div>
           <div className="text-right flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5 opacity-80">FARE</p>
              <p className="text-xl font-black text-primary tracking-tighter leading-none">PGK {activeRide?.fare || '0.00'}</p>
           </div>
        </motion.div>
      </div>

      {/* Bottom Sheet Context */}
      <div className="mt-auto relative z-20 p-4 pb-8">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface p-7 rounded-[40px] shadow-premium space-y-7 border border-white/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
             <div className="flex -space-x-3">
                <div className="size-14 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-sm relative z-20">
                   <img src={activeRide?.driver_avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"} alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div className="size-14 rounded-2xl border-4 border-white bg-slate-50 flex items-center justify-center shadow-sm text-xs font-black text-slate-400 z-10">
                   +2
                </div>
             </div>
             <div className="flex-1 ml-5">
                <h4 className="text-xl font-black text-primary tracking-tighter leading-tight">{activeRide?.driver_name || 'James K.'}</h4>
                <p className="text-[11px] font-bold text-slate-400 truncate max-w-[150px] uppercase tracking-wider mt-1 opacity-80">{activeRide?.destination_address}</p>
             </div>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="size-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/10 shadow-sm"
             >
                <span className="material-symbols-outlined font-black">sos</span>
             </motion.button>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
             <motion.div 
                initial={{ width: "30%" }}
                animate={{ width: "85%" }}
                transition={{ duration: 15, ease: "linear" }}
                className="h-full bg-success shadow-[0_0_12px_rgba(16,185,129,0.5)] rounded-full relative z-10"
             />
             <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
             />
          </div>
        </motion.div>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-[48px] p-10 shadow-premium border border-white/20 flex flex-col items-center text-center gap-6 max-w-sm"
            >
              <div className="size-24 bg-success rounded-[32px] flex items-center justify-center text-white shadow-premium relative">
                <span className="material-symbols-outlined text-5xl font-black">check</span>
                <span className="absolute inset-0 size-full bg-success/20 rounded-[32px] animate-ping"></span>
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter text-primary">Destination Reached</h3>
                <p className="text-slate-500 font-bold text-sm mt-3 leading-relaxed opacity-80">We hope you had a pleasant journey! Your receipt is now available in your activity history.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal Overlay */}
      <AnimatePresence>
        {showReview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface rounded-[48px] p-8 shadow-premium flex flex-col items-center w-full max-w-sm border border-white/20"
            >
              <div className="size-24 rounded-[32px] border-4 border-slate-50 overflow-hidden mb-6 shadow-premium bg-slate-100">
                <img src={activeRide?.driver_avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"} alt="Driver" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-2 text-primary">Rate your trip</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 opacity-60">How was {activeRide?.driver_name || 'James K.'}?</p>
              
              <div className="flex gap-2.5 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button 
                    key={star} 
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setRating(star)} 
                    className="cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-4xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-slate-200'}`} style={{ fontVariationSettings: `\"FILL\" ${rating >= star ? 1 : 0}` }}>star</span>
                  </motion.button>
                ))}
              </div>

              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience... (optional)"
                className="w-full h-32 bg-slate-50/50 border border-border-subtle rounded-3xl p-5 text-primary font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 mb-8 resize-none transition-all"
              ></textarea>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full h-16 bg-primary text-white font-black rounded-2xl tracking-tight shadow-premium disabled:opacity-50 transition-all text-lg border-b-4 border-slate-900"
              >
                {isSubmitting ? (
                  <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Submit Review'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
