import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socketService } from '../../services/socket';
import { rideService } from '../../services/api';
import MapView from '../../components/MapView';
import { motion, AnimatePresence } from 'framer-motion';
import { locationService } from '../../services/location';
import SlideButton from '../../components/SlideButton';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const ActiveTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(location.state?.ride);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    console.log("ActiveTrip: Component mounted. Ride data:", ride);
    if (!ride) {
      console.warn("ActiveTrip: No ride data found in location state. Redirecting...");
      // Try to recover from local storage if available, or just redirect
      const storedRide = localStorage.getItem('activeRide');
      if (storedRide) {
        setRide(JSON.parse(storedRide));
      } else {
        navigate('/');
      }
      return;
    }

    socketService.joinRide(ride.id);

    const locationInterval = setInterval(async () => {
      if (ride.status === 'accepted' || ride.status === 'in_progress') {
        try {
          const position = await locationService.getCurrentPosition();
          socketService.emitLocationUpdate(ride.id, position.coords.latitude, position.coords.longitude);
        } catch (error) {
          console.error("Broadcasting location error:", error);
        }
      }
    }, 5000);

    return () => clearInterval(locationInterval);
  }, [ride, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    console.log(`ActiveTrip: Updating status to ${newStatus}`);
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const updatedRide = await rideService.updateRideStatus(ride.id, newStatus, token, user.id);
      const finalRide = updatedRide || { ...ride, status: newStatus };
      setRide(finalRide);
      
      if (newStatus === 'completed') {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error("ActiveTrip: Failed to update status:", error);
      alert("Status update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEmergency = () => alert("SOS Triggered");

  if (!ride) return null;

  const currentStep = ride.status === 'accepted' ? 'pickup' : 'trip';

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-background font-body text-primary h-full flex flex-col relative overflow-hidden"
    >
      {/* HEADER - ABSOLUTE (To stay within App container) */}
      <header className="absolute top-0 left-0 right-0 z-[60] px-4 pt-6 pb-8 glass-surface border-b border-white/20 rounded-b-[40px] shadow-premium">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined text-white text-2xl font-black">
              {currentStep === 'pickup' ? 'person_pin_circle' : 'navigation'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-[9px] font-black tracking-[0.2em] uppercase mb-1 opacity-80">
              {currentStep === 'pickup' ? 'Heading to pickup' : 'Heading to destination'}
            </p>
            <h1 className="text-primary font-black text-base leading-tight tracking-tighter truncate">
              {currentStep === 'pickup' ? ride.pickup_address : ride.destination_address}
            </h1>
          </div>
          <div className="glass-surface px-3 py-1.5 rounded-xl text-center border border-white/40 shrink-0">
            <p className="text-success font-black text-lg tracking-tighter leading-none">{ride.duration || '4'}</p>
            <p className="text-[8px] font-black text-slate-400 mt-0.5 uppercase tracking-widest leading-none">MIN</p>
          </div>
        </div>
      </header>

      {/* MAP */}
      <main className="flex-1 w-full relative z-0">
        <MapView 
          center={ride.status === 'accepted' ? [ride.pickup_lat, ride.pickup_lng] : [ride.destination_lat, ride.destination_lng]} 
          zoom={15} 
          className="w-full h-full" 
        />

        {/* CONTROLS */}
        <div className="absolute right-4 top-36 flex flex-col gap-3 z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="size-11 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-premium border border-white/40 text-primary"
          >
            <span className="material-symbols-outlined font-black text-xl">my_location</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEmergency}
            className="size-11 rounded-xl bg-accent shadow-premium flex items-center justify-center text-white border-b-2 border-accent-hover"
          >
            <span className="material-symbols-outlined font-black text-xl">sos</span>
          </motion.button>
        </div>
      </main>

      {/* RIDER CARD - ABSOLUTE BOTTOM (Stay within App, above BottomNav) */}
      <section className="absolute bottom-6 left-0 right-0 z-50 px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-surface rounded-[32px] shadow-premium border border-white/20 p-5 overflow-hidden relative"
        >
          {/* Handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-100 rounded-full opacity-50"></div>

          <div className="flex items-center justify-between mb-5 mt-2">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  alt="Rider"
                  className="size-12 rounded-xl object-cover border-2 border-slate-50 shadow-sm"
                  src={ride.rider_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-primary border-2 border-white text-[8px] font-black px-1 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
                  {ride.rider_rating || '4.9'} <span className="material-symbols-outlined text-[8px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="font-black text-base text-primary tracking-tighter leading-none truncate">{ride.rider_name}</h2>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-tight opacity-80">
                  <span className="material-symbols-outlined text-[12px]">chat_bubble</span>
                  <span className="truncate">"I'm at the pickup point"</span>
                </div>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="size-11 rounded-xl bg-slate-50 border border-border-subtle flex items-center justify-center text-primary shadow-sm"
            >
              <span className="material-symbols-outlined font-black text-xl">call</span>
            </motion.button>
          </div>

          <SlideButton 
            onComplete={() => handleUpdateStatus(ride.status === 'accepted' ? 'in_progress' : 'completed')}
            text={ride.status === 'accepted' ? 'Slide to Pick Up' : 'Slide to Complete'}
            color={ride.status === 'accepted' ? '#1D3557' : '#10B981'}
            isLoading={isUpdating}
            icon={ride.status === 'accepted' ? 'person_pin_circle' : 'verified'}
          />

          <div className="mt-4 flex items-center justify-between px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-50">
             <span>FARE: PGK {ride.fare}</span>
             <span>{ride.distance}</span>
          </div>
        </motion.div>
      </section>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface rounded-[40px] p-8 shadow-premium border border-white/20 flex flex-col items-center text-center gap-5 max-w-[280px]"
            >
              <div className="size-20 bg-success rounded-[24px] flex items-center justify-center text-white shadow-premium relative">
                <span className="material-symbols-outlined text-4xl font-black">check</span>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-primary">Ride Completed</h3>
                <p className="text-slate-500 font-bold text-xs mt-2 leading-relaxed opacity-80">Excellent work! Trip finished.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActiveTrip;
