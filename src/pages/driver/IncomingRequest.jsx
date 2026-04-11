import React from 'react';

const IncomingRequest = () => {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-container overflow-hidden h-screen w-screen relative">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
            <img
              alt="Driver Profile Photo"
              className="w-full h-full object-cover"
              data-alt="close-up portrait of a professional male driver in a clean white shirt, smiling warmly with soft sunlight filtering through car window"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKAaphyozPUQHBXtLvzEeohHia64ndoQc-4WspjfAToVoU8cOohMrQt1Og9FAl_ly9fZBeursfeu-v8PH_aukxaZKhPc0WQGb3EedxeTdi1OfKIUY2MzH-c-RaSdVEPEDtf1CTF5OE-YYBpGe7fiGfLPlrBOQf2SV3Crc5-cuaAl5xtcRaqXr4lYjw5rj098-L_hCaifKdeC45GgwUib8wTZsoxTcfh9QGo2ziE8LBIu2u-2fygYBEzyxrSI4CeNOBQftRSnUPZzqb"
            />
          </div>
          <span className="plusJakartaSans font-bold text-lg tracking-tight text-blue-900 dark:text-blue-100">
            Navigator
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">ONLINE</span>
        </div>
        <div className="style_separation_logic bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full absolute bottom-0"></div>
      </header>

      {/* Map Canvas (Background) */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-90"
          data-alt="detailed city street map with navigation routes highlighted in glowing blue and pickup points marked with soft pulsing circles"
          data-location="San Francisco"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtgdYpPhjA3hUJFRHb5YEnsoPaIpS5kls02Ne5kSTGSqshxCP65hBdNkDFx3CXZonGNDLu5AosVV8iXAUHUSNopWs7M5qvm3uHrylh7Tkm5NbvlHlrzdsc_hWcXHGJazot_m96eJqIVNrOfK7uYfHf3_6WRVivWCAxxY2SgTq427nDUjvn9W5uKEO4ZSFvO8ULaOGQ1AYEPrX3C4u6ztNChNrgc8QC1cL14IVkkkmv2sKTXCVjUyUCH2n9FhQwJYT1kqUbZDiTOnKw"
          alt="Map Background"
        />

        {/* Map HUDs (Floating UI elements) */}
        <div className="absolute top-24 right-6 flex flex-col gap-4">
          <button className="w-12 h-12 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-lg text-primary active:scale-90 transition-all">
            <span className="material-symbols-outlined">my_location</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-lg text-primary active:scale-90 transition-all">
            <span className="material-symbols-outlined">explore</span>
          </button>
        </div>
        <div className="absolute top-24 left-6">
          <div className="bg-tertiary-container/90 backdrop-blur-md text-on-tertiary px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl border border-white/10">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <span className="text-sm font-bold plusJakartaSans tracking-tight uppercase">High Demand Zone</span>
          </div>
        </div>
      </div>

      {/* Main Content Canvas (Focused UI) */}
      <main className="relative z-10 h-full flex flex-col justify-end px-4 pb-8 pointer-events-none">
        {/* Trip Request Card */}
        <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-[2.5rem] p-6 shadow-[0_24px_48px_rgba(3,22,54,0.12)] pointer-events-auto border border-white/40 flex flex-col gap-6">
          {/* Trip Header: Rider Info & Price */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-high ring-4 ring-surface-container-low shadow-inner">
                <img
                  alt="Rider Profile"
                  className="w-full h-full object-cover"
                  data-alt="studio portrait of a young woman with a friendly expression, soft neutral background, professional lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnLhjOnz5MmvHeIpcmD3l7k6KOr6F6l2GXtEf28n_MvlctiVt2zbKwdbsyWnJDeqoHZ8d9E8uY9-u2S1-bKrvNnjcOAu8yeY95ZQ51aW8jCsqglQb1aRACfdPrtOvz4JwXdA06ey-mssAHiroyJjz_V-KpPFHp7c3hktvuIQ4QZHR0tQUMSNYki5eUViwa1SycQacDkDM3eKLS7h6Y5XE7Wy4Ph56uFcGe2VMVXci_p_HZb9aNVEyTWmi8pFnVRd4NXeJkPTHgATzH"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="plusJakartaSans font-extrabold text-2xl tracking-tight text-primary">Sarah Jenkins</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-on-surface">4.9</span>
                  <span className="text-on-surface-variant text-sm ml-1">• New Request</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
                Estimated Fare
              </span>
              <div className="bg-primary-container text-on-primary rounded-2xl px-4 py-2">
                <span className="plusJakartaSans font-extrabold text-3xl tracking-tighter">$15.50</span>
              </div>
            </div>
          </div>

          {/* Route Details: Asymmetric Bento Style */}
          <div className="bg-surface-container-low rounded-3xl p-5 flex flex-col gap-6 relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-500 via-primary to-emerald-500"></div>

            {/* Pickup */}
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person_pin_circle
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                  Pickup • 3 min away
                </span>
                <p className="plusJakartaSans font-bold text-lg text-primary leading-tight">1248 Market Street, SF</p>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                  Drop-off • 14 min trip
                </span>
                <p className="plusJakartaSans font-bold text-lg text-primary leading-tight">Embarcadero Center, Pier 3</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button className="flex-1 py-5 rounded-2xl bg-surface-container-high text-on-surface font-bold text-lg plusJakartaSans active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">close</span>
              Decline
            </button>
            <button className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-extrabold text-xl plusJakartaSans active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
              Accept
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Urgent Countdown Timer */}
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-on-tertiary-container h-full w-2/3 rounded-full"></div>
          </div>
          <p className="text-center text-on-surface-variant text-xs font-bold tracking-widest uppercase -mt-2">
            12 Seconds Remaining
          </p>
        </div>
      </main>

      {/* Contextual FAB - SOS Button */}
      <div className="fixed bottom-10 right-6 z-50">
        <button className="w-14 h-14 rounded-full bg-tertiary-container text-white flex items-center justify-center shadow-[0_8px_24px_rgba(95,0,5,0.4)] active:scale-90 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            emergency
          </span>
        </button>
      </div>
    </div>
  );
};

export default IncomingRequest;
