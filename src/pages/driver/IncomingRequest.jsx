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
  
  // Use real data from navigation state, fallback to empty if missing (though it shouldn't be)
  const ride = location.state?.ride || {};

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

  if (!ride.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-base text-on-surface font-body h-full relative overflow-hidden flex flex-col"
    >
      {/* Full-Screen Map Background */}
      <MapView center={mapCenter} zoom={15} userImage={ride?.rider_avatar} className="absolute inset-0 w-full h-full z-0 opacity-40 grayscale contrast-125" />
      
      {/* Map Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent z-[1] pointer-events-none"></div>

      {/* Notice Message Overlay */}
      <AnimatePresence>
        {noticeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 z-50 bg-error/90 text-on-error p-5 rounded-3xl shadow-premium flex items-center gap-4 backdrop-blur-md border border-white/10"
          >
            <div className="size-10 min-w-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined font-black text-xl">warning</span>
            </div>
            <p className="font-bold text-sm tracking-tight">{noticeMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM HEADER */}
      <div className="absolute top-8 left-6 right-6 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-surface-container/80 backdrop-blur-md px-5 py-3 rounded-full border border-white/5 shadow-premium">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Navigator</span>
        </div>
        
        <div className={`px-5 py-3 rounded-full shadow-premium flex items-center gap-3 border border-white/5 transition-colors backdrop-blur-md ${
          isOnline ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
        }`}>
          {isOnline && <span className="size-2 bg-primary rounded-full animate-pulse shadow-glow"></span>}
          <span className="text-[10px] font-black tracking-widest uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* ERGONOMIC SOS */}
      <div className="absolute right-6 top-[35%] z-20">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEmergency}
          className="size-16 rounded-full bg-error text-on-error flex items-center justify-center shadow-premium border-4 border-base">
          <span className="material-symbols-outlined font-black text-2xl">sos</span>
        </motion.button>
      </div>

      {/* INCOMING REQUEST BOTTOM SHEET */}
      <div className="mt-auto relative z-30 p-6 pb-10">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface-container rounded-[40px] shadow-2xl flex flex-col border border-white/5 p-8 pt-6 relative overflow-hidden"
        >
          {/* Decorative Drag Handle */}
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>

          <div className="space-y-10">
            {/* Header: Rider Info & High-Impact Fare */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="size-18 rounded-3xl overflow-hidden border-4 border-base shadow-premium bg-surface-bright">
                    <img src={ride.rider_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ride.rider_name || 'Rider')}&background=1C1B1B&color=46F1C5&bold=true`} alt={ride.rider_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-surface-bright rounded-xl px-2.5 py-1 shadow-premium border border-white/5 flex items-center gap-1.5">
                     <span className="text-primary material-symbols-outlined text-[12px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="text-[10px] font-black text-on-surface">{ride.rider_rating || '4.9'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black tracking-tighter leading-none text-on-surface">{ride.rider_name || 'New Rider'}</h2>
                  <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-lg w-fit border border-primary/20">
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase">Priority</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-on-surface-variant text-[10px] font-black tracking-[0.3em] uppercase mb-2 opacity-60">Estimated</p>
                <p className="text-4xl font-black text-primary tracking-tighter leading-none">PGK {ride.fare}</p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-10 relative py-2">
              <div className="absolute left-[13px] top-10 bottom-10 w-[2px] bg-white/5"></div>

              {/* Pickup Row */}
              <div className="flex gap-7 items-start relative z-10">
                <div className="size-7 rounded-full bg-primary flex items-center justify-center ring-8 ring-base shadow-glow shrink-0">
                  <div className="size-2 bg-base rounded-full"></div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant text-[10px] font-black tracking-[0.2em] uppercase opacity-40">PICKUP</span>
                    <div className="bg-primary text-base px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-tight uppercase">
                      3 min away
                    </div>
                  </div>
                  <p className="text-xl font-bold tracking-tight mt-3 leading-tight text-on-surface truncate">{ride.pickup_address}</p>
                </div>
              </div>

              {/* Dropoff Row */}
              <div className="flex gap-7 items-start relative z-10">
                <div className="size-7 rounded-full bg-surface-bright flex items-center justify-center ring-8 ring-base shadow-premium shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-on-surface font-black">location_on</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-on-surface-variant text-[10px] font-black tracking-[0.2em] uppercase opacity-40">DROP-OFF</span>
                    <div className="bg-white/5 text-on-surface-variant px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-tight uppercase">
                      {ride.duration} Trip
                    </div>
                  </div>
                  <p className="text-xl font-bold tracking-tight mt-3 leading-tight text-on-surface truncate">{ride.destination_address}</p>
                </div>
              </div>
            </div>

            {/* Countdown Bar */}
            <div className="relative pt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-error text-[10px] font-black tracking-[0.4em] uppercase opacity-80">
                  Decision Expires in {timeLeft}s
                </p>
                <div className="size-2 bg-error rounded-full animate-ping shadow-glow"></div>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                   initial={{ width: "100%" }}
                   animate={{ width: `${(timeLeft / 12) * 100}%` }}
                   transition={{ duration: 1, ease: "linear" }}
                   className="bg-error h-full rounded-full shadow-premium"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-5 pt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDecline}
                disabled={isAccepting}
                className="flex-1 h-18 rounded-pill border border-white/10 text-on-surface-variant font-black text-[11px] tracking-[0.3em] uppercase hover:bg-white/5 transition-all disabled:opacity-50">
                Decline
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex-[2.5] h-18 rounded-pill teal-pulse-gradient text-on-background font-black text-lg tracking-[0.1em] shadow-teal-glow flex items-center justify-center gap-4 transition-all disabled:opacity-50 uppercase">
                {isAccepting ? (
                  <div className="size-6 border-4 border-base/30 border-t-base rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Accept Trip</span>
                    <span className="material-symbols-outlined font-black text-xl">bolt</span>
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
