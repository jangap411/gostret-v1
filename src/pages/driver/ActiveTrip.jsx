import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socketService } from '../../services/socket';
import { rideService } from '../../services/api';
import MapView from '../../components/MapView';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

const ActiveTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(location.state?.ride);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!ride) {
      navigate('/');
      return;
    }

    socketService.joinRide(ride.id);

    // Broadcast location periodically
    const locationInterval = setInterval(() => {
      if (ride.status === 'accepted' || ride.status === 'in_progress') {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            socketService.emitLocationUpdate(ride.id, position.coords.latitude, position.coords.longitude);
          });
        }
      }
    }, 5000);

    return () => clearInterval(locationInterval);
  }, [ride, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const updatedRide = await rideService.updateRideStatus(ride.id, newStatus, token);
      setRide(updatedRide);
      if (newStatus === 'completed') {
        alert('Trip Completed! Great job navigator.');
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Status update failed. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEmergency = () => alert("SOS Triggered");

  const currentStep = ride.status === 'accepted' ? 'pickup' : 'trip';

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="bg-neutral-50 font-body text-[#141414] h-full flex flex-col relative overflow-hidden"
    >
      {/* Top Navigation Header (Instructions) */}
      <header className="fixed top-0 w-full z-50 px-4 pt-6 pb-8 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm rounded-b-[2rem]">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="bg-[#1D3557] p-3 rounded-2xl flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {currentStep === 'pickup' ? 'person_pin_circle' : 'navigation'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-neutral-500 text-sm font-semibold tracking-wider uppercase mb-1">
              {currentStep === 'pickup' ? 'Heading to pickup' : 'Heading to destination'}
            </p>
            <h1 className="text-[#141414] font-headline font-bold text-xl leading-tight">
              {currentStep === 'pickup' ? ride.pickup_address : ride.destination_address}
            </h1>
          </div>
          <div className="bg-green-50 border border-green-100 px-3 py-2 rounded-xl text-center shadow-sm">
            <p className="text-green-700 font-headline font-extrabold text-lg">{ride.duration || '6'}</p>
            <p className="text-green-800/70 text-[10px] font-bold">MIN</p>
          </div>
        </div>
      </header>

      {/* Main Map Canvas */}
      <main className="flex-1 w-full relative">
        <div className="absolute inset-0 z-0 bg-neutral-100">
          <MapView 
            center={[ride.pickup_lat, ride.pickup_lng]} 
            zoom={15} 
            className="w-full h-full" 
          />

          {/* Map Overlay UI Elements */}
          <div className="absolute right-4 top-40 flex flex-col gap-3 z-10">
            <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md border border-neutral-100 text-[#1D3557] active:scale-95 transition-transform">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>
          <button 
            onClick={onEmergency}
            className="absolute left-4 top-40 w-14 h-14 rounded-full bg-[#D9483E] shadow-lg border-2 border-white flex items-center justify-center text-white active:scale-90 transition-all z-10">
            <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
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
                  alt="Rider"
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-neutral-50 shadow-sm"
                  src={ride.rider_avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAXX57dqlxz3G07pGosgaWUs23NGCkLRxAyCyM4Sixluldt_SbFWivuQNVgzBF7NN9zlN3PNbmIMjZPUqMNKN_gh0FP7HMAmZD24Ikel16uAXLsfFtKjE_TAcHBX1MTYHkfUnc95qxPsID9HFhZT4MtGhu500Qtr22sX-IumKYkfGjhQrA2knZ7sJA6mCjkeOZ1McsRu3VvcokRDmYQhef-I6UHUvnfW6phrYKbrH9rIoC9xgzMoP1oRNgY56OQTfT5X4lSmYKJdWVx"}
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 border-2 border-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                  {ride.rider_rating || '4.9'} <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <div>
                <h2 className="font-headline font-extrabold text-xl text-[#141414]">{ride.rider_name}</h2>
                <div className="flex items-center gap-2 text-neutral-500 text-sm mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                  <span className="font-medium truncate max-w-[150px]">"I'm at the pickup point"</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1D3557] active:scale-90 transition-transform">
                <span className="material-symbols-outlined">call</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div 
            onClick={() => handleUpdateStatus(ride.status === 'accepted' ? 'in_progress' : 'completed')}
            className={`relative w-full h-16 ${ride.status === 'accepted' ? 'bg-[#F3F0E7]' : 'bg-green-50'} border border-neutral-200 rounded-full flex items-center p-1.5 overflow-hidden group cursor-pointer shadow-inner ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center w-full">
              <span className="font-headline font-extrabold text-[#1D3557]/60 text-sm tracking-widest pointer-events-none uppercase">
                {isUpdating ? 'Updating...' : ride.status === 'accepted' ? 'Slide to Pick Up Rider' : 'Slide to Complete Trip'}
              </span>
            </div>
            <div className={`h-13 w-13 ${ride.status === 'accepted' ? 'bg-[#1D3557]' : 'bg-[#10B981]'} rounded-full flex items-center justify-center text-white shadow-lg z-10 transition-all hover:scale-[0.98] active:scale-95 aspect-square`}>
              <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 px-2">
             <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider">
                Price: PGK {ride.fare} • {ride.distance}
             </span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ActiveTrip;
