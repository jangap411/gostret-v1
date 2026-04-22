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
      transition={{ duration: 0.3 }}
      className="bg-background text-primary font-body h-full relative overflow-hidden flex flex-col"
    >
      {/* Full-Screen Map Background */}
      <MapView center={mapCenter} zoom={15} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Map Overlay Shade */}
      <div className="absolute inset-0 bg-slate-900/10 z-[1] pointer-events-none"></div>

      {/* Clean Notice Overlay */}
      <AnimatePresence>
        {noticeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-24 left-4 right-4 z-50 bg-accent text-white p-5 rounded-3xl shadow-premium flex items-center gap-4 backdrop-blur-md border border-white/20"
          >
            <div className="size-11 min-w-11 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined font-black">warning</span>
            </div>
            <p className="font-black text-[15px] leading-tight tracking-tight">{noticeMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Header Consistency */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 glass-surface px-5 py-3 rounded-full border border-white/20 shadow-premium pointer-events-auto">
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-primary">NAVIGATOR</span>
        </div>
        <div className={`${isOnline ? 'bg-success' : 'bg-slate-500'} text-white px-5 py-3 rounded-full shadow-premium flex items-center gap-2.5 pointer-events-auto border border-white/20`}>
          {isOnline && <span className="size-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>}
          <span className="text-[10px] font-black tracking-widest uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Floating SOS Button */}
      <div className="absolute right-4 top-[35%] z-20">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEmergency}
          className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-premium border-4 border-white active:scale-90 transition-all">
          <span className="material-symbols-outlined font-black text-2xl">sos</span>
        </motion.button>
      </div>

      {/* Bottom Sheet Request Card */}
      <div className="mt-auto relative z-30">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="bg-surface rounded-t-[48px] shadow-premium flex flex-col border-t border-white/20"
        >
          {/* Drag Handle */}
          <div className="w-14 h-1.5 bg-slate-100 rounded-full mx-auto mt-5 mb-8"></div>

          <div className="px-8 pb-12 space-y-10">
            {/* Header: Rider Info & Price */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="size-16 rounded-[24px] overflow-hidden border-4 border-slate-50 shadow-sm bg-slate-100">
                    <img src={ride.rider_avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"} alt={ride.rider_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-xl size-7 shadow-premium border border-slate-50 flex items-center justify-center">
                     <span className="text-[11px] font-black text-primary">{ride.rider_rating}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black tracking-tighter leading-none text-primary">{ride.rider_name}</h2>
                  <div className="inline-flex items-center bg-success/10 text-success px-2.5 py-1 rounded-xl w-fit mt-2 border border-success/10">
                    <span className="text-[10px] font-black tracking-[0.15em] uppercase">NEW REQUEST</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-60">EST. FARE</p>
                <p className="text-4xl font-black text-primary tracking-tighter leading-none">PGK {ride.fare}</p>
              </div>
            </div>

            {/* Trip Details Section - HIGH READABILITY */}
            <div className="space-y-10 relative">
              <div className="absolute left-[13px] top-8 bottom-8 w-[3px] bg-slate-100 rounded-full"></div>

              {/* Pickup Row */}
              <div className="flex gap-6 items-start relative z-10">
                <div className="size-7 rounded-full bg-primary flex items-center justify-center ring-4 ring-white shadow-premium mt-1">
                  <div className="size-2.5 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase opacity-60">PICKUP</span>
                    <div className="bg-success text-white px-2.5 py-1 rounded-xl text-[10px] font-black shadow-sm tracking-tight">
                      3 min away
                    </div>
                  </div>
                  <p className="text-[22px] font-black tracking-tight mt-2 leading-tight text-primary">{ride.pickup_address}</p>
                </div>
              </div>

              {/* Dropoff Row */}
              <div className="flex gap-6 items-start relative z-10">
                <div className="size-7 rounded-full bg-accent flex items-center justify-center ring-4 ring-white shadow-premium mt-1">
                  <span className="material-symbols-outlined text-[16px] text-white font-black">location_on</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase opacity-60">DROP-OFF</span>
                    <div className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-xl text-[10px] font-black tracking-tight">
                      {ride.duration} trip
                    </div>
                  </div>
                  <p className="text-[22px] font-black tracking-tight mt-2 leading-tight text-primary">{ride.destination_address}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer Area */}
            <div className="relative pt-2">
              <div className="flex justify-between items-center mb-3">
                <p className="text-accent text-[11px] font-black tracking-[0.25em] uppercase opacity-80">
                  AUTO-DECLINE IN {timeLeft}S
                </p>
                <div className="size-2 bg-accent rounded-full animate-ping"></div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                   initial={{ width: "100%" }}
                   animate={{ width: `${(timeLeft / 12) * 100}%` }}
                   transition={{ duration: 1, ease: "linear" }}
                   className="bg-accent h-full rounded-full shadow-[0_0_12px_rgba(217,72,62,0.4)]"
                />
              </div>
            </div>

            {/* Proportional Action Buttons - TACTILE */}
            <div className="flex gap-4 pt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDecline}
                disabled={isAccepting}
                className="flex-1 h-16 rounded-[24px] border-2 border-border-subtle text-primary font-black text-[13px] tracking-[0.2em] uppercase hover:bg-slate-50 transition-all disabled:opacity-50">
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
                    <span>Accept Request</span>
                    <span className="material-symbols-outlined font-black">arrow_forward</span>
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
