import React, { useState, useEffect } from 'react';
import MapView from '../../components/MapView';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { rideService } from '../../services/api';
import { socketService } from '../../services/socket';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRide } from '../../store/rideSlice';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const IncomingRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.driver.isOnline);
  
  const ride = location.state?.ride || {
    id: 1,
    rider_name: "Sarah Jenkins",
    rider_rating: "4.9",
    fare: "15.50",
    distance: "3.2km",
    duration: "14 min",
    pickup_address: "1248 Market Street, SF",
    destination_address: "Embarcadero Center, Pier 3",
  };

  const [timeLeft, setTimeLeft] = useState(12);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isAccepting, setIsAccepting] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  
  const [mapCenter] = useState([ride.pickup_lat || -9.43869006941101, ride.pickup_lng || 147.1810054779053]);

  useEffect(() => {
    if (ride?.id) {
        socketService.joinRide(ride.id);
    }
    
    socketService.onStatusUpdate((data) => {
      if (data.status === 'accepted' && data.driver_id && data.driver_id !== user.id) {
        setNoticeMessage("Request picked up by another driver.");
        setTimeout(() => navigate('/'), 3000);
      }
    });

    return () => socketService.off('status_update');
  }, [ride.id, user.id, navigate]);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const token = localStorage.getItem('token');
      const updatedRide = await rideService.updateRideStatus(ride.id, 'accepted', token, user.id);
      dispatch(setActiveRide(updatedRide));
      navigate('/driver/active-trip', { state: { ride: updatedRide } });
    } catch (error) {
      console.error("Failed to accept ride:", error);
      setNoticeMessage("Request already accepted.");
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setIsAccepting(false);
    }
  };

  const onDecline = () => navigate('/');
  const onEmergency = () => alert('SOS Alerted');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-background text-primary font-body h-full relative overflow-hidden flex flex-col"
    >
      {/* Full-Screen Map Background */}
      <MapView center={mapCenter} zoom={15} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Map Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>

      {/* Notice Message Overlay */}
      <AnimatePresence>
        {noticeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 z-50 bg-accent text-white p-5 rounded-[28px] shadow-premium flex items-center gap-4 backdrop-blur-md border border-white/20"
          >
            <div className="size-11 min-w-11 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined font-black">warning</span>
            </div>
            <p className="font-black text-[15px] leading-tight tracking-tight">{noticeMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM HEADER - GLASSMORPHISM */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2 glass-surface px-5 py-3 rounded-full border border-white/20 shadow-premium">
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-primary opacity-80">Navigator</span>
        </div>
        
        <div className={`px-5 py-3 rounded-full shadow-premium flex items-center gap-3 border border-white/20 transition-colors ${
          isOnline ? 'bg-success text-white' : 'bg-slate-500 text-white'
        }`}>
          {isOnline && <span className="size-2 bg-white rounded-full animate-pulse shadow-sm"></span>}
          <span className="text-[10px] font-black tracking-widest uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* ERGONOMIC SOS */}
      <div className="absolute right-4 top-[35%] z-20">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEmergency}
          className="size-16 rounded-full bg-accent text-white flex items-center justify-center shadow-premium border-4 border-white">
          <span className="material-symbols-outlined font-black text-2xl">sos</span>
        </motion.button>
      </div>

      {/* INCOMING REQUEST BOTTOM SHEET */}
      <div className="mt-auto relative z-30 p-4 pb-8">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface rounded-[48px] shadow-premium flex flex-col border border-white/20 p-8 pt-6 relative overflow-hidden"
        >
          {/* Decorative Drag Handle */}
          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-8 opacity-50"></div>

          <div className="space-y-10">
            {/* Header: Rider Info & High-Impact Fare */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="size-16 rounded-[28px] overflow-hidden border-4 border-slate-50 shadow-premium bg-slate-100">
                    <img src={ride.rider_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"} alt={ride.rider_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-xl px-2 py-0.5 shadow-sm border border-slate-50 flex items-center gap-1">
                     <span className="text-yellow-400 material-symbols-outlined text-[10px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="text-[10px] font-black text-primary">{ride.rider_rating}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black tracking-tighter leading-none text-primary">{ride.rider_name}</h2>
                  <div className="inline-flex items-center bg-success/10 text-success px-3 py-1 rounded-xl w-fit mt-2.5 border border-success/10">
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase">PRIORITY REQUEST</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-slate-400 text-[9px] font-black tracking-[0.25em] uppercase mb-1 opacity-60">EST. FARE</p>
                <p className="text-4xl font-black text-primary tracking-tighter leading-none">PGK {ride.fare}</p>
              </div>
            </div>

            {/* Trip Details - MAX READABILITY */}
            <div className="space-y-12 relative py-2">
              <div className="absolute left-[13px] top-10 bottom-10 w-0.5 bg-slate-100/50"></div>

              {/* Pickup Row */}
              <div className="flex gap-7 items-start relative z-10">
                <div className="size-7 rounded-full bg-primary flex items-center justify-center ring-4 ring-white shadow-sm shrink-0">
                  <div className="size-2 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase opacity-60">PICKUP</span>
                    <div className="bg-success text-white px-2.5 py-0.5 rounded-lg text-[9px] font-black shadow-sm tracking-tight uppercase">
                      3 min away
                    </div>
                  </div>
                  <p className="text-[22px] font-black tracking-tight mt-3 leading-tight text-primary truncate">{ride.pickup_address}</p>
                </div>
              </div>

              {/* Dropoff Row */}
              <div className="flex gap-7 items-start relative z-10">
                <div className="size-7 rounded-full bg-accent flex items-center justify-center ring-4 ring-white shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[15px] text-white font-black">location_on</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase opacity-60">DROP-OFF</span>
                    <div className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-tight uppercase opacity-80">
                      {ride.duration} trip
                    </div>
                  </div>
                  <p className="text-[22px] font-black tracking-tight mt-3 leading-tight text-primary truncate">{ride.destination_address}</p>
                </div>
              </div>
            </div>

            {/* Pulsating Countdown Bar */}
            <div className="relative pt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-accent text-[10px] font-black tracking-[0.3em] uppercase opacity-80">
                  DECISION EXPIRES IN {timeLeft}S
                </p>
                <div className="size-2.5 bg-accent rounded-full animate-ping shadow-[0_0_8px_rgba(217,72,62,0.5)]"></div>
              </div>
              <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden shadow-inner border border-slate-100 relative">
                <motion.div 
                   initial={{ width: "100%" }}
                   animate={{ width: `${(timeLeft / 12) * 100}%` }}
                   transition={{ duration: 1, ease: "linear" }}
                   className="bg-accent h-full rounded-full shadow-premium relative z-10"
                />
                <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
                />
              </div>
            </div>

            {/* Proportional Action Targets */}
            <div className="flex gap-4 pt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDecline}
                disabled={isAccepting}
                className="flex-1 h-16 rounded-[24px] border-2 border-border-subtle text-slate-400 font-black text-[11px] tracking-[0.25em] uppercase hover:bg-slate-50 hover:text-primary transition-all disabled:opacity-50">
                DECLINE
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex-[2.5] h-16 rounded-[24px] bg-primary text-white font-black text-xl tracking-tight shadow-premium flex items-center justify-center gap-3 transition-all disabled:opacity-50 border-b-4 border-slate-900">
                {isAccepting ? (
                  <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Accept Trip</span>
                    <span className="material-symbols-outlined font-black">bolt</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IncomingRequest;
