import React from 'react';

const ActiveTrip = ({
  instructionDist = "In 450 meters",
  instructionText = "Turn right onto Oak Avenue",
  etaMins = "6",
  riderName = "Marcus Thompson",
  riderImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAXX57dqlxz3G07pGosgaWUs23NGCkLRxAyCyM4Sixluldt_SbFWivuQNVgzBF7NN9zlN3PNbmIMjZPUqMNKN_gh0FP7HMAmZD24Ikel16uAXLsfFtKjE_TAcHBX1MTYHkfUnc95qxPsID9HFhZT4MtGhu500Qtr22sX-IumKYkfGjhQrA2knZ7sJA6mCjkeOZ1McsRu3VvcokRDmYQhef-I6UHUvnfW6phrYKbrH9rIoC9xgzMoP1oRNgY56OQTfT5X4lSmYKJdWVx",
  riderRating = "4.9",
  riderMessage = "I'm at the north entrance",
  tripDistance = "4.2 km",
  estFare = "18.40",
  pickupAddress = "1200 Metropolitan Pkwy, Building 4",
  mapImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAWD8YAaDoaVuh0WVRA3A5cpKZeTVHzSAyrd_RX65SNw7dtVBTTyKZBBl6Eakkb8anEfmEjQbxDc0wL9_D_5PFdSJrxCgGyvlL-q0fJDe0WkqcgyjnC10dNlzQa1p1kn7cGNJixVSMaRYKJ5W1UVVcGR0Bjoz1vvTtNE1x7fICgzZ11-1jNdoZN3UaOpdm4vPQrsXEcR3ziazKhhlgxl6Wwj9g9ze4ylpPNAE0GH3pNaXacIbboDG9pi13Oqw3GZH2-hajK2zO2KltF",
  onCallRider,
  onMessageRider,
  onSlideToPickup,
  onEmergency,
}) => {
  return (
    <div className="bg-neutral-50 font-body text-[#141414] overflow-hidden h-screen w-screen flex flex-col">
      {/* Top Navigation Header (Instructions) */}
      <header className="fixed top-0 w-full z-50 px-4 pt-6 pb-8 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm rounded-b-[2rem]">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="bg-[#1D3557] p-3 rounded-2xl flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              turn_slight_right
            </span>
          </div>
          <div className="flex-1">
            <p className="text-neutral-500 text-sm font-semibold tracking-wider uppercase mb-1">
              {instructionDist}
            </p>
            <h1 className="text-[#141414] font-headline font-bold text-2xl leading-tight">
              {instructionText}
            </h1>
          </div>
          <div className="bg-green-50 border border-green-100 px-3 py-2 rounded-xl text-center shadow-sm">
            <p className="text-green-700 font-headline font-extrabold text-lg">{etaMins}</p>
            <p className="text-green-800/70 text-[10px] font-bold">MIN</p>
          </div>
        </div>
      </header>

      {/* Main Map Canvas */}
      <main className="flex-1 w-full relative">
        <div className="absolute inset-0 z-0 bg-neutral-100">
          <img
            className="w-full h-full object-cover opacity-90"
            src={mapImage}
            alt="Map Canvas"
          />

          {/* Map Overlay UI Elements */}
          <div className="absolute right-4 top-40 flex flex-col gap-3 z-10">
            <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md border border-neutral-100 text-[#1D3557] active:scale-95 transition-transform">
              <span className="material-symbols-outlined">my_location</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md border border-neutral-100 text-[#1D3557] active:scale-95 transition-transform">
              <span className="material-symbols-outlined">layers</span>
            </button>
          </div>
          <button 
            onClick={onEmergency}
            className="absolute left-4 top-40 w-14 h-14 rounded-full bg-[#D9483E] shadow-lg border-2 border-white flex items-center justify-center text-white active:scale-90 transition-all z-10">
            <span className="material-symbols-outlined text-3xl font-bold">
              sos
            </span>
          </button>
        </div>
      </main>

      {/* Bottom Rider Information Card */}
      <section className="fixed bottom-0 w-full z-50">
        <div className="max-w-xl mx-auto bg-white rounded-t-[2.5rem] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] border-t border-neutral-100 p-6 pb-8">
          <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6"></div>
          
          {/* Rider Profile & Details */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  alt={`${riderName} Profile`}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-neutral-50 shadow-sm"
                  src={riderImage}
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 border-2 border-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                  {riderRating} <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <div>
                <h2 className="font-headline font-extrabold text-xl text-[#141414]">{riderName}</h2>
                <div className="flex items-center gap-2 text-neutral-500 text-sm mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                  <span className="font-medium truncate max-w-[150px]">"{riderMessage}"</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onCallRider}
                className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1D3557] active:scale-90 transition-transform">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button 
                onClick={onMessageRider}
                className="w-12 h-12 rounded-2xl bg-[#1D3557] text-white shadow-md flex items-center justify-center active:scale-90 transition-transform">
                <span className="material-symbols-outlined">message</span>
              </button>
            </div>
          </div>

          {/* Trip Meta Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
              <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                Trip Distance
              </p>
              <p className="font-headline font-bold text-lg text-[#1D3557]">{tripDistance}</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
              <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                Est. Fare
              </p>
              <p className="font-headline font-bold text-lg text-[#1D3557]">${estFare}</p>
            </div>
          </div>

          {/* Swipe Action Component */}
          <div 
            onClick={onSlideToPickup}
            className="relative w-full h-16 bg-[#F3F0E7] border border-neutral-200 rounded-full flex items-center p-1.5 overflow-hidden group cursor-pointer shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center w-full">
              <span className="font-headline font-extrabold text-[#1D3557]/60 text-sm tracking-widest pointer-events-none uppercase">
                Slide to Pick Up Rider
              </span>
            </div>
            <div className="h-13 w-13 bg-[#1D3557] rounded-full flex items-center justify-center text-white shadow-lg z-10 transition-all hover:bg-[#152a48] hover:scale-[0.98] active:scale-95 aspect-square">
              <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
            </div>
          </div>

          {/* Address Indicator */}
          <div className="mt-6 flex items-start gap-3 px-2">
            <span className="material-symbols-outlined text-[#D9483E] mt-0.5">location_on</span>
            <div>
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                Pickup Address
              </p>
              <p className="text-sm font-semibold text-[#141414] mt-0.5">{pickupAddress}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActiveTrip;
