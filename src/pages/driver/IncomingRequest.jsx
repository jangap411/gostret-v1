import React, { useState, useEffect } from 'react';
import MapView from '../../components/MapView';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const IncomingRequest = ({
  riderName = "Sarah Jenkins",
  riderImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  riderRating = "4.9",
  estFare = "15.50",
  pickupTime = "3 min away",
  pickupAddress = "1248 Market Street, SF",
  dropoffTime = "14 min trip",
  dropoffAddress = "Embarcadero Center, Pier 3",
  secondsRemaining = 12,
  onAccept = () => console.log('Accepted'),
  onDecline = () => window.history.back(),
  onEmergency = () => alert('SOS Alerted'),
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(secondsRemaining);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  
  // Simulated map center
  const [mapCenter] = useState([-9.43869006941101, 147.1810054779053]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="bg-[#FCFBF8] text-[#1D3557] font-body h-full relative overflow-hidden flex flex-col">
      {/* Full-Screen Map Background */}
      <MapView center={mapCenter} zoom={15} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Map Overlay Shade */}
      <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none"></div>

      {/* Floating Header Consistency (Reduced for focus) */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm pointer-events-auto">
          <span className="text-[10px] font-black tracking-widest uppercase opacity-80">Navigator</span>
        </div>
        <div className="bg-[#10B981] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto border border-white/20">
          <span className="size-1.5 bg-white rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black tracking-widest">ONLINE</span>
        </div>
      </div>

      {/* Floating SOS Button */}
      <div className="absolute right-4 top-[40%] z-20">
        <button 
          onClick={onEmergency}
          className="w-14 h-14 rounded-full bg-[#D9483E] text-white flex items-center justify-center shadow-2xl border-4 border-white active:scale-90 transition-all">
          <span className="material-symbols-outlined font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sos</span>
        </button>
      </div>

      {/* Bottom Sheet Request Card */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-[40px] shadow-[0_-12px_48px_rgba(0,0,0,0.15)] flex flex-col max-h-[85vh] overflow-hidden border-t border-neutral-100"
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mt-4 mb-6"></div>

          <div className="px-8 pb-10 space-y-8 overflow-y-auto no-scrollbar">
            {/* Header: Rider Info & Price */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="size-14 rounded-full overflow-hidden border-2 border-[#10B981]/20">
                    <img src={riderImage} alt={riderName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full size-6 shadow-sm border border-neutral-100 flex items-center justify-center">
                     <span className="text-[10px] font-black">{riderRating}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-black tracking-tighter leading-tight">{riderName}</h2>
                  <div className="inline-flex items-center bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-lg w-fit mt-1">
                    <span className="text-[10px] font-black tracking-widest uppercase">NEW REQUEST</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-neutral-400 text-[9px] font-black tracking-widest uppercase mb-1">PRICE</p>
                <p className="text-2xl font-black text-[#1D3557] tracking-tighter leading-none">PGK {estFare}</p>
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="space-y-8 relative">
              {/* Dotted Vertical Line */}
              <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-[radial-gradient(circle_at_center,_#d1d5db_1px,_transparent_1px)] bg-[length:1px_8px]"></div>

              {/* Pickup Row */}
              <div className="flex gap-5 items-start relative z-10">
                <div className="size-6 rounded-full bg-[#1D3557] flex items-center justify-center ring-4 ring-white shadow-sm mt-1">
                  <div className="size-2 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[10px] font-black tracking-widest uppercase">PICKUP</span>
                    <div className="bg-[#10B981] text-white px-2 py-0.5 rounded-lg text-[9px] font-black shadow-sm">
                      {pickupTime}
                    </div>
                  </div>
                  <p className="text-lg font-black tracking-tight mt-1 leading-tight">{pickupAddress}</p>
                </div>
              </div>

              {/* Dropoff Row */}
              <div className="flex gap-5 items-start relative z-10">
                <div className="size-6 rounded-full bg-[#10B981] flex items-center justify-center ring-4 ring-white shadow-sm mt-1">
                  <span className="material-symbols-outlined text-[14px] text-white font-black" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[10px] font-black tracking-widest uppercase">DROP-OFF</span>
                    <div className="bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-lg text-[9px] font-black">
                      {dropoffTime}
                    </div>
                  </div>
                  <p className="text-lg font-black tracking-tight mt-1 leading-tight">{dropoffAddress}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer Area */}
            <div className="relative pt-4">
              <p className="text-center text-[#D9483E] text-[10px] font-extrabold tracking-[0.2em] mb-3 uppercase">
                {timeLeft}S TO ACCEPT
              </p>
              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: "100%" }}
                   animate={{ width: `${(timeLeft / secondsRemaining) * 100}%` }}
                   transition={{ duration: 1, ease: "linear" }}
                   className="bg-gradient-to-r from-[#D9483E] to-[#F59E0B] h-full rounded-full"
                />
              </div>
            </div>

            {/* Proportional Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={onDecline}
                className="flex-1 py-5 rounded-[20px] border-2 border-neutral-100 text-[#1D3557] font-black text-sm tracking-widest uppercase hover:bg-neutral-50 active:scale-95 transition-all">
                DECLINE
              </button>
              <button 
                onClick={onAccept}
                className="flex-[2.5] py-5 rounded-[20px] bg-[#1D3557] text-white font-black text-lg tracking-tight shadow-xl shadow-[#1D3557]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                Accept Request
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default IncomingRequest;
