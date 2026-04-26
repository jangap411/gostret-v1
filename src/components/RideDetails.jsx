import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { rideService } from '../services/api';
import { setActiveRide } from '../store/rideSlice';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
};

export default function RideDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pickup = useSelector((state) => state.ride.pickup);
  const destination = useSelector((state) => state.ride.destination);

  const [route, setRoute] = useState(null);
  const [routeMeta, setRouteMeta] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [booking, setBooking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('regular');
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userImage = user?.avatar_url;

  useEffect(() => {
    const fetchRoute = async () => {
      if (pickup?.marker?.position && destination?.marker?.position) {
        setLoadingRoute(true);
        try {
          const apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
          const [lat1, lon1] = pickup.marker.position;
          const [lat2, lon2] = destination.marker.position;
          
          const res = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`);
          const data = await res.json();
          
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const coords = feature.geometry.coordinates.map(c => [c[1], c[0]]);
            setRoute(coords);
            
            const { distance, duration } = feature.properties.summary;
            const distKm = (distance / 1000).toFixed(1) + ' km';
            const durMin = Math.round(duration / 60) + ' min';
            setRouteMeta({ distance: distKm, duration: durMin });
          }
        } catch (error) {
          console.error("Failed to fetch route", error);
        } finally {
          setLoadingRoute(false);
        }
      }
    };

    fetchRoute();
  }, [pickup, destination]);

  const handleBookRide = async () => {
    if (!pickup?.marker || !destination?.marker) return;

    setBooking(true);
    try {
      const token = localStorage.getItem('token');
      const rideData = {
        pickup_address: pickup.query,
        destination_address: destination.query,
        pickup_lat: pickup.marker.position[0],
        pickup_lng: pickup.marker.position[1],
        destination_lat: destination.marker.position[0],
        destination_lng: destination.marker.position[1],
        fare: selectedOption === 'regular' ? 12.34 : (selectedOption === 'premium' ? 18.51 : 22.78),
        distance: routeMeta?.distance,
        duration: routeMeta?.duration,
      };

      const ride = await rideService.requestRide(rideData, token);
      dispatch(setActiveRide(ride));
      navigate('/searching-driver');
    } catch (error) {
      console.error("Booking failed", error);
      setErrorMessage(error.message || "Failed to book ride.");
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setBooking(false);
    }
  };

  const mapMarkers = [];
  if (pickup?.marker) mapMarkers.push({ ...pickup.marker, popup: 'Pickup' });
  if (destination?.marker) mapMarkers.push({ ...destination.marker, popup: 'Destination' });

  const mapCenter = destination?.marker?.position || pickup?.marker?.position || [-9.43869006941101, 147.1810054779053];

  const rideOptions = [
    { id: 'regular', name: 'GoStret Regular', time: '4 min', price: 'PGK 12.34', icon: 'directions_car' },
    { id: 'premium', name: 'GoStret Premium', time: '6 min', price: 'PGK 18.51', icon: 'auto_awesome' },
    { id: 'xl', name: 'GoStret XL', time: '8 min', price: 'PGK 22.78', icon: 'airport_shuttle' }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-background justify-between group/design-root overflow-x-hidden font-body"
    >
      <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar pb-32">
        {/* Sticky Header */}
        <div className="glass-surface flex items-center p-4 justify-between sticky top-0 z-50 border-b border-white/20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="text-primary flex size-11 shrink-0 items-center justify-center hover:bg-white/40 transition rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </motion.button>
          <h2 className="text-primary text-xl font-black leading-tight tracking-tighter flex-1 text-center pr-11 uppercase">
            Ride Details
          </h2>
        </div>

        {/* Route Summary Card */}
        <div className="px-4 pt-6 flex flex-col gap-3">
          <div className="glass-surface rounded-[32px] p-5 shadow-premium border border-white/40 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <div className="size-2.5 bg-primary rounded-full shadow-sm border-2 border-white"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">PICKUP</span>
                <p className="text-primary font-bold truncate tracking-tight">{pickup?.query || 'Not selected'}</p>
              </div>
            </div>

            <div className="absolute left-[24px] top-[48px] bottom-[48px] w-0.5 bg-slate-100/50 z-0"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center">
                 <span className="material-symbols-outlined text-accent text-xl font-black">location_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">DESTINATION</span>
                <p className="text-primary font-bold truncate tracking-tight">{destination?.query || 'Not selected'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="px-4 py-6">
          <div className="w-full aspect-[4/3] rounded-[32px] overflow-hidden relative z-0 border-4 border-white shadow-premium bg-slate-100">
            <MapView 
              center={mapCenter} 
              zoom={13} 
              markers={mapMarkers} 
              userImage={userImage}
              route={route}
              routeMeta={routeMeta}
              className="absolute inset-0 w-full h-full z-0" 
            />
            
            <AnimatePresence>
              {(loadingRoute || booking) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center"
                >
                  <div className="flex items-center gap-4 glass-surface px-6 py-4 rounded-full shadow-premium border border-white/40">
                    <div className="size-6 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-primary font-black text-sm tracking-tight">
                      {booking ? 'SECURELY BOOKING...' : 'PLOTTING ROUTE...'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {routeMeta && !loadingRoute && (
               <div className="absolute top-4 right-4 glass-surface px-4 py-2 rounded-2xl shadow-premium border border-white/40 z-10 flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">EST. TRIP</span>
                  <p className="text-primary font-black text-lg tracking-tighter leading-none">{routeMeta.distance} · {routeMeta.duration}</p>
               </div>
            )}
          </div>
        </div>
        
        {/* Ride Options Section */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] opacity-60">Choose your ride</h3>
            <div className="size-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>

          <div className="flex flex-col gap-3">
            {rideOptions.map((option, i) => (
              <motion.div 
                key={option.id} 
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOption(option.id)}
                className={`flex items-center gap-4 px-5 h-[84px] justify-between cursor-pointer transition-all rounded-3xl border ${
                  selectedOption === option.id 
                    ? 'bg-white border-primary shadow-premium ring-4 ring-primary/5' 
                    : 'bg-surface border-border-subtle hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`size-14 flex items-center justify-center rounded-2xl transition-colors ${
                    selectedOption === option.id ? 'bg-primary text-white shadow-premium' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-2xl font-black">{option.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-primary text-lg font-black leading-none tracking-tight">{option.name}</p>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-2 opacity-80">{option.time} away · Friendly</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary text-xl font-black tracking-tighter leading-none">{option.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Error Message Toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 20 }}
             className="fixed bottom-28 left-4 right-4 z-[100] bg-accent text-white p-5 rounded-[24px] shadow-premium flex items-center gap-4 backdrop-blur-md border border-white/20"
          >
            <div className="size-10 min-w-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined font-black">warning</span>
            </div>
            <p className="font-black text-sm tracking-tight">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 glass-surface border-t border-white/20 z-[60]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBookRide}
          disabled={booking || loadingRoute}
          className={`w-full h-16 flex items-center justify-center gap-3 rounded-[24px] bg-accent text-white font-black tracking-tight transition-all text-lg shadow-premium border-b-4 border-accent-hover ${
            booking || loadingRoute ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent-hover'
          }`}
        >
          {booking ? (
            <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">bolt</span>
              <span>Book {rideOptions.find(o => o.id === selectedOption)?.name}</span>
            </>
          )}
        </motion.button>
      </div>

    </motion.div>
  );
}
