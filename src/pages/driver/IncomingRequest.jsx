import React from 'react';

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
  mapImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBtgdYpPhjA3hUJFRHb5YEnsoPaIpS5kls02Ne5kSTGSqshxCP65hBdNkDFx3CXZonGNDLu5AosVV8iXAUHUSNopWs7M5qvm3uHrylh7Tkm5NbvlHlrzdsc_hWcXHGJazot_m96eJqIVNrOfK7uYfHf3_6WRVivWCAxxY2SgTq427nDUjvn9W5uKEO4ZSFvO8ULaOGQ1AYEPrX3C4u6ztNChNrgc8QC1cL14IVkkkmv2sKTXCVjUyUCH2n9FhQwJYT1kqUbZDiTOnKw",
  onAccept,
  onDecline,
  onEmergency,
  onLocation,
  onExplore,
}) => {
  return (
    <div className="bg-neutral-50 text-[#141414] font-body selection:bg-[#E8E4D8] overflow-hidden h-screen w-screen relative">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
            <img
              alt="Driver Profile Photo"
              className="w-full h-full object-cover"
              src={driverImage}
            />
          </div>
          <span className="plusJakartaSans font-bold text-lg tracking-tight text-[#1D3557]">
            Navigator
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-bold text-green-700">ONLINE</span>
        </div>
      </header>

      {/* Map Canvas (Background) */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-90"
          alt="Map Background"
          src={mapImage}
        />

        {/* Map HUDs (Floating UI elements) */}
        <div className="absolute top-24 right-6 flex flex-col gap-4">
          <button 
            onClick={onLocation}
            className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md border border-neutral-100 text-[#1D3557] active:scale-90 transition-all">
            <span className="material-symbols-outlined">my_location</span>
          </button>
          <button 
            onClick={onExplore}
            className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md border border-neutral-100 text-[#1D3557] active:scale-90 transition-all">
            <span className="material-symbols-outlined">explore</span>
          </button>
        </div>
        <div className="absolute top-24 left-6">
          <div className="bg-[#D9483E]/90 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md border border-white/20">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="text-sm font-bold plusJakartaSans tracking-tight uppercase">High Demand</span>
          </div>
        </div>
      </div>

      {/* Main Content Canvas (Focused UI) */}
      <main className="relative z-10 h-full flex flex-col justify-end px-4 pb-8 pointer-events-none">
        {/* Trip Request Card */}
        <div className="w-full max-w-lg mx-auto bg-white rounded-[2.5rem] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] pointer-events-auto border border-neutral-100 flex flex-col gap-6">
          {/* Trip Header: Rider Info & Price */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
                <img
                  alt={`${riderName} Profile`}
                  className="w-full h-full object-cover"
                  src={riderImage}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="plusJakartaSans font-extrabold text-2xl tracking-tight text-[#141414]">{riderName}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-yellow-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-[#141414]">{riderRating}</span>
                  <span className="text-neutral-500 text-sm ml-1">• {requestType}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">
                Est. Fare
              </span>
              <div className="bg-[#1D3557] text-[#FCFBF8] rounded-2xl px-4 py-2 shadow-md border border-[#11233e]">
                <span className="plusJakartaSans font-extrabold text-3xl tracking-tighter">${estFare}</span>
              </div>
            </div>
          </div>

          {/* Route Details: Asymmetric Bento Style */}
          <div className="bg-[#F3F0E7] rounded-3xl p-5 flex flex-col gap-6 relative border border-neutral-200">
            {/* Vertical Progress Line */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#1D3557] via-[#D9483E] to-green-600"></div>

            {/* Pickup */}
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-6 h-6 rounded-full bg-[#1D3557] flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person_pin_circle
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
                  Pickup • <span className="text-[#141414]">{pickupTime}</span>
                </span>
                <p className="plusJakartaSans font-bold text-lg text-[#141414] leading-tight">{pickupAddress}</p>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
                  Drop-off • <span className="text-[#141414]">{dropoffTime}</span>
                </span>
                <p className="plusJakartaSans font-bold text-lg text-[#141414] leading-tight">{dropoffAddress}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-1">
            <button 
              onClick={onDecline}
              className="flex-1 py-5 rounded-2xl bg-neutral-100 text-[#141414] font-bold text-lg plusJakartaSans active:scale-[0.98] transition-all flex items-center justify-center border border-neutral-200 hover:bg-neutral-200">
              Decline
            </button>
            <button 
              onClick={onAccept}
              className="flex-[2] py-5 rounded-2xl bg-[#1D3557] text-[#FCFBF8] font-extrabold text-xl plusJakartaSans active:scale-[0.98] transition-all shadow-md shadow-[#1D3557]/20 flex items-center justify-center gap-2 hover:bg-[#152a48]">
              Accept Request
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </div>

          {/* Urgent Countdown Timer */}
          <div className="w-full pt-2">
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mb-2 pointer-events-none">
                <div 
                  className="bg-[#D9483E] h-full rounded-full transition-all duration-1000 ease-linear" 
                  style={{ width: `${(parseInt(secondsRemaining) / 15) * 100}%` }}>
                </div>
            </div>
            <p className="text-center text-[#D9483E] text-xs font-bold tracking-widest uppercase">
              {secondsRemaining} Seconds Remaining
            </p>
          </div>
        </div>
      </main>

      {/* Contextual FAB - SOS Button */}
      <div className="fixed bottom-10 right-6 z-50">
        <button 
          onClick={onEmergency}
          className="w-14 h-14 rounded-full bg-[#D9483E] text-white flex items-center justify-center shadow-lg border-2 border-white active:scale-90 transition-all">
          <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            sos
          </span>
        </button>
      </div>
    </div>
  );
};

export default IncomingRequest;
