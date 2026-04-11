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
    <div className="bg-surface font-body text-on-surface overflow-hidden h-screen w-screen flex flex-col">
      {/* Top Navigation Header (Instructions) */}
      <header className="fixed top-0 w-full z-50 px-4 pt-6 pb-8 bg-gradient-to-b from-[rgba(3,22,54,0.95)] to-[rgba(3,22,54,0.8)] backdrop-blur-md rounded-b-[2rem] shadow-lg">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="bg-on-primary/10 p-3 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              turn_slight_right
            </span>
          </div>
          <div className="flex-1">
            <p className="text-on-primary-container text-sm font-semibold tracking-wider uppercase mb-1">
              {instructionDist}
            </p>
            <h1 className="text-on-primary font-headline font-bold text-2xl leading-tight">
              {instructionText}
            </h1>
          </div>
          <div className="bg-on-primary-container/20 px-3 py-2 rounded-xl text-center">
            <p className="text-on-primary font-headline font-extrabold text-lg">{etaMins}</p>
            <p className="text-on-primary-container text-[10px] font-bold">MIN</p>
          </div>
        </div>
      </header>

      {/* Main Map Canvas */}
      <main className="flex-1 w-full relative">
        <div className="absolute inset-0 z-0 bg-surface-dim">
          <img
            className="w-full h-full object-cover"
            src={mapImage}
            alt="Map Canvas"
          />

          {/* Map Overlay UI Elements */}
          <div className="absolute right-4 top-40 flex flex-col gap-3 z-10">
            <button className="w-12 h-12 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center shadow-lg text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined">my_location</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center shadow-lg text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined">layers</span>
            </button>
          </div>
          <button 
            onClick={onEmergency}
            className="absolute left-4 top-40 w-14 h-14 rounded-full bg-tertiary-container shadow-[0_0_24px_rgba(95,0,5,0.4)] flex items-center justify-center text-on-tertiary active:scale-90 transition-all z-10">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency_home
            </span>
          </button>
        </div>
      </main>

      {/* Bottom Rider Information Card */}
      <section className="fixed bottom-0 w-full z-50 p-4">
        <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-[2.5rem] shadow-[0_-8px_40px_rgba(3,22,54,0.12)] p-6">
          {/* Rider Profile & Details */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  alt={`${riderName} Profile`}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-surface-container-low"
                  src={riderImage}
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  {riderRating} <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <div>
                <h2 className="font-headline font-bold text-xl text-primary">{riderName}</h2>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  <span className="font-medium">"{riderMessage}"</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onCallRider}
                className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary active:scale-90 transition-transform">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button 
                onClick={onMessageRider}
                className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform">
                <span className="material-symbols-outlined">message</span>
              </button>
            </div>
          </div>

          {/* Trip Meta Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-low rounded-2xl p-4">
              <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
                Trip Distance
              </p>
              <p className="font-headline font-bold text-lg text-primary">{tripDistance}</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4">
              <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
                Est. Fare
              </p>
              <p className="font-headline font-bold text-lg text-primary">${estFare}</p>
            </div>
          </div>

          {/* Swipe Action Component */}
          <div 
            onClick={onSlideToPickup}
            className="relative w-full h-20 bg-surface-container-highest rounded-full flex items-center p-2 overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center w-full">
              <span className="font-headline font-extrabold text-on-primary-container/60 text-base tracking-tight pointer-events-none">
                SLIDE TO PICK UP RIDER
              </span>
            </div>
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-xl z-10 transition-all hover:bg-primary-container hover:scale-95 active:scale-95">
              <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
            </div>
            <div
              className="h-full absolute left-0 bg-primary/10 rounded-full transition-all duration-300 pointer-events-none"
              style={{ width: '15%' }}
            ></div>
          </div>

          {/* Address Indicator */}
          <div className="mt-6 flex items-start gap-3 px-2">
            <span className="material-symbols-outlined text-on-tertiary-container mt-0.5">location_on</span>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Pickup Address
              </p>
              <p className="text-sm font-semibold text-primary">{pickupAddress}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActiveTrip;
