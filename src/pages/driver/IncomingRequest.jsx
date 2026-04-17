import React, { useState, useEffect } from 'react';
import MapView from '../../components/MapView';
import { useNavigate } from 'react-router-dom';

const IncomingRequest = ({
  driverImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDKAaphyozPUQHBXtLvzEeohHia64ndoQc-4WspjfAToVoU8cOohMrQt1Og9FAl_ly9fZBeursfeu-v8PH_aukxaZKhPc0WQGb3EedxeTdi1OfKIUY2MzH-c-RaSdVEPEDtf1CTF5OE-YYBpGe7fiGfLPlrBOQf2SV3Crc5-cuaAl5xtcRaqXr4lYjw5rj098-L_hCaifKdeC45GgwUib8wTZsoxTcfh9QGo2ziE8LBIu2u-2fygYBEzyxrSI4CeNOBQftRSnUPZzqb",
  riderName = "Sarah Jenkins",
  riderImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAnLhjOnz5MmvHeIpcmD3l7k6KOr6F6l2GXtEf28n_MvlctiVt2zbKwdbsyWnJDeqoHZ8d9E8uY9-u2S1-bKrvNnjcOAu8yeY95ZQ51aW8jCsqglQb1aRACfdPrtOvz4JwXdA06ey-mssAHiroyJjz_V-KpPFHp7c3hktvuIQ4QZHR0tQUMSNYki5eUViwa1SycQacDkDM3eKLS7h6Y5XE7Wy4Ph56uFcGe2VMVXci_p_HZb9aNVEyTWmi8pFnVRd4NXeJkPTHgATzH",
  riderRating = "4.9",
  requestType = "New Request",
  estFare = "15.50",
  pickupTime = "3 min away",
  pickupAddress = "1248 Market Street, SF",
  dropoffTime = "14 min trip",
  dropoffAddress = "Embarcadero Center, Pier 3",
  secondsRemaining = "12",
  onAccept = () => console.log('Accepted'),
  onDecline = () => window.history.back(),
  onEmergency = () => alert('SOS Alerted'),
}) => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isOnline] = useState(true);
  
  // Simulated map center for the demo
  const [mapCenter] = useState([-9.43869006941101, 147.1810054779053]);

  return (
    <div className="bg-neutral-50 text-[#141414] font-body h-full relative overflow-hidden flex flex-col">
      {/* Full-Screen Map Background */}
      <MapView center={mapCenter} zoom={15} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Map Overlay Shade */}
      <div className="absolute inset-0 bg-black/5 z-[1] shadow-inner pointer-events-none"></div>

      {/* Floating Minimal Header */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm pointer-events-auto">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <img src={user.avatar_url || driverImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] font-black text-[#1D3557] tracking-widest uppercase">Navigator</span>
        </div>

        <div className={`pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg border border-white/20 bg-[#10B981] text-white`}>
          <span className="size-2 bg-white rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black tracking-widest uppercase">ONLINE</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col justify-end p-4 pb-12 pointer-events-none overflow-y-auto w-full no-scrollbar">
        {/* Trip Request Card */}
        <div className="w-full max-w-sm mx-auto bg-white rounded-[32px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col gap-6 pointer-events-auto">
          
          {/* Header: Rider & Pricing */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="size-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                   <img src={riderImage} alt={riderName} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-lg px-1.5 py-0.5 shadow-sm flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-[10px] font-black">{riderRating}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-[#1D3557] tracking-tighter leading-tight">{riderName}</h2>
                <span className="text-neutral-400 text-[10px] font-black tracking-widest uppercase">{requestType}</span>
              </div>
            </div>
            <div className="bg-[#1D3557] text-[#FCFBF8] rounded-2xl px-5 py-3 shadow-lg border border-white/10 flex flex-col items-center">
              <span className="text-[9px] font-black tracking-widest uppercase opacity-60">PRICE</span>
              <span className="text-2xl font-black tracking-tighter leading-none mt-1">PGK {estFare}</span>
            </div>
          </div>

          {/* Route Details Bento */}
          <div className="bg-neutral-50 rounded-3xl p-6 flex flex-col gap-8 relative border border-neutral-100 shadow-inner">
             {/* Vertical Timeline Line */}
             <div className="absolute left-[35px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#1D3557] via-[#D9483E] to-[#10B981] opacity-20"></div>

             {/* Pickup */}
             <div className="flex gap-4 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#1D3557] border border-neutral-100">
                  <span className="material-symbols-outlined font-black">person_pin_circle</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[9px] font-black tracking-widest uppercase">Pickup</span>
                    <span className="bg-[#1D3557]/10 text-[#1D3557] px-2 py-0.5 rounded-lg text-[9px] font-black">{pickupTime}</span>
                  </div>
                  <p className="font-bold text-[#1D3557] text-md leading-tight mt-0.5">{pickupAddress}</p>
                </div>
             </div>

             {/* Dropoff */}
             <div className="flex gap-4 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#10B981] border border-neutral-100">
                  <span className="material-symbols-outlined font-black">location_on</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[9px] font-black tracking-widest uppercase">Drop-off</span>
                    <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-lg text-[9px] font-black">{dropoffTime}</span>
                  </div>
                  <p className="font-bold text-[#1D3557] text-md leading-tight mt-0.5">{dropoffAddress}</p>
                </div>
             </div>
          </div>

          {/* Action Area */}
          <div className="space-y-4">
             {/* Timer */}
             <div className="w-full">
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-[#D9483E] h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(217,72,62,0.4)]" 
                    style={{ width: `${(parseInt(secondsRemaining) / 15) * 100}%` }}>
                  </div>
                </div>
                <p className="text-center text-[#D9483E] text-[10px] font-black tracking-[0.2em] uppercase">
                  {secondsRemaining}s to accept
                </p>
             </div>

             <div className="flex gap-3">
               <button 
                 onClick={onDecline}
                 className="flex-1 py-5 rounded-2xl bg-neutral-50 text-[#1D3557] font-black text-sm tracking-widest uppercase border border-neutral-100 active:scale-95 transition-all">
                 Decline
               </button>
               <button 
                 onClick={onAccept}
                 className="flex-[2] py-5 rounded-2xl bg-[#1D3557] text-[#FCFBF8] font-black text-lg tracking-tight active:scale-95 transition-all shadow-xl shadow-[#1D3557]/20 flex items-center justify-center gap-2">
                 Accept Request
                 <span className="material-symbols-outlined font-black">chevron_right</span>
               </button>
             </div>
          </div>
        </div>
      </main>

      {/* Floating SOS FAB */}
      <button 
        onClick={onEmergency}
        className="absolute right-4 bottom-32 z-50 w-14 h-14 rounded-full bg-[#D9483E] text-white shadow-2xl flex items-center justify-center border-4 border-white/20 active:scale-90 transition-all">
        <span className="material-symbols-outlined font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sos</span>
      </button>
    </div>
  );
};

export default IncomingRequest;
