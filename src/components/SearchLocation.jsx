import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPickup, setDestination } from '../store/rideSlice';
import MapView from './MapView';
import { locationService } from '../services/location';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const resultVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 }
  })
};

export default function SearchLocation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const pickup = useSelector((state) => state.ride.pickup);
  const destination = useSelector((state) => state.ride.destination);

  const [activeField, setActiveField] = useState('destination'); 
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [results, setResults] = useState([]);
  const [isMapSelectionMode, setIsMapSelectionMode] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userImage = user?.avatar_url;

  const activeQuery = activeField === 'pickup' ? pickup.query : destination.query;

  const searchLocation = async (text) => {
    try {
      const apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
      const res = await fetch(`https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(text)}&boundary.country=PG`);
      const data = await res.json();
      if (data.features) {
        setResults(data.features);
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const coordString = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    let locationName = coordString;
    try {
      const apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
      const res = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lng}&point.lat=${lat}`);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const label = feature.properties.name || feature.properties.label || feature.properties.street || "";
        if (label) {
          locationName = `${label}`;
        }
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
    }
    return locationName;
  };

  const populateCurrentLocation = async () => {
    try {
      const position = await locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      
      setMapCenter([latitude, longitude]);
      dispatch(setPickup({ 
        query: address, 
        marker: { position: [latitude, longitude], popup: address } 
      }));
    } catch (error) {
      console.error("Error populating current location:", error);
    }
  };

  useEffect(() => {
    if (!pickup.marker && (pickup.query === '' || pickup.query === 'Current location')) {
      populateCurrentLocation();
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const coordRegex = /^-?\d+\.\d+,\s*-?\d+\.\d+$/;
      if (activeQuery === 'Current location' || coordRegex.test(activeQuery) || isMapSelectionMode) {
        setResults([]);
        return;
      }
      if (activeQuery.trim().length > 2) {
        searchLocation(activeQuery);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [activeQuery, activeField, isMapSelectionMode]);

  const handleSelect = (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    let label = feature.properties.label || feature.properties.name;
    setMapCenter([lat, lon]);
    const newMarker = { position: [lat, lon], popup: label };
    
    if (activeField === 'pickup') {
       dispatch(setPickup({ query: label, marker: newMarker }));
    } else {
       dispatch(setDestination({ query: label, marker: newMarker }));
    }
    setResults([]);
    setIsMapSelectionMode(false);
  };

  const toggleMapSelection = () => {
    setIsMapSelectionMode(!isMapSelectionMode);
    setResults([]);
  };

  const handleMapClick = async (e) => {
    if (!isMapSelectionMode) return;
    const { lat, lng } = e.latlng;
    setMapCenter([lat, lng]);
    
    const locationName = await reverseGeocode(lat, lng);
    const newMarker = { position: [lat, lng], popup: locationName };
    
    if (activeField === 'pickup') {
      dispatch(setPickup({ query: locationName, marker: newMarker }));
    } else {
      dispatch(setDestination({ query: locationName, marker: newMarker }));
    }
    setIsMapSelectionMode(false);
  };

  const mapMarkers = [];
  if (pickup.marker) mapMarkers.push({ ...pickup.marker, popup: 'Pickup: ' + pickup.marker.popup, userImage: userImage });
  if (destination.marker) mapMarkers.push({ ...destination.marker, popup: 'Destination: ' + destination.marker.popup });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-screen w-full flex-col bg-background overflow-hidden font-body"
    >
      {/* IMMERSIVE MAP BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <MapView 
          center={mapCenter} 
          zoom={14} 
          markers={mapMarkers}
          userImage={userImage}
          onMapClick={handleMapClick}
          className="absolute inset-0 w-full h-full z-0 grayscale-[0.2]"
        />
        {/* Depth Gradients */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-base/90 via-base/40 to-transparent z-[1] pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-base/90 to-transparent z-[1] pointer-events-none"></div>
      </div>

      {/* FLOATING COMMAND CENTER (SEARCH CARD) */}
      <div className="relative z-50 px-4 pt-6 w-full max-w-[600px] mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-surface rounded-[32px] p-2 shadow-premium border border-white/10"
        >
          {/* Header Bar */}
          <div className="flex items-center p-2 gap-3">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)} 
              className="text-primary flex size-10 shrink-0 items-center justify-center hover:bg-white/10 transition rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined font-black">arrow_back</span>
            </motion.button>
            <h2 className="text-primary text-sm font-black uppercase tracking-[0.2em] opacity-60">
              Plan Journey
            </h2>
          </div>

          <div className="p-3 flex flex-col gap-3 relative">
            {/* Visual Connector Line */}
            <div className="absolute left-[35px] top-[45px] bottom-[45px] w-0.5 bg-primary/10 z-0"></div>
            
            {/* Pickup Input */}
            <motion.div 
              animate={{ scale: activeField === 'pickup' ? 1.01 : 1 }}
              className={`flex items-center h-14 w-full rounded-2xl border transition-all relative z-10 ${
                activeField === 'pickup' 
                  ? 'border-primary/50 bg-white shadow-premium ring-4 ring-primary/5' 
                  : 'border-white/5 bg-surface-container/40'
              } overflow-hidden`}
            >
              <div className="size-12 shrink-0 flex items-center justify-center">
                 <div className="size-3 bg-primary rounded-full shadow-sm border-2 border-white"></div>
              </div>
              <input
                placeholder="Pickup location"
                value={pickup.query}
                onFocus={() => { setActiveField('pickup'); setResults([]); setIsMapSelectionMode(false); }}
                onChange={(e) => dispatch(setPickup({ query: e.target.value, marker: null }))}
                className={`flex-1 bg-transparent border-none outline-none focus:ring-0 font-bold placeholder:font-medium text-base p-0 transition-colors ${
                  activeField === 'pickup' ? 'text-slate-900 placeholder:text-slate-400' : 'text-on-surface placeholder:text-on-surface/20'
                }`}
              />
              {pickup.query && (
                <button onClick={() => dispatch(setPickup({ query: '', marker: null }))} className={`size-12 flex items-center justify-center transition-colors ${activeField === 'pickup' ? 'text-slate-400 hover:text-slate-600' : 'text-on-surface/20 hover:text-on-surface'}`}>
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </motion.div>

            {/* Destination Input */}
            <motion.div 
              animate={{ scale: activeField === 'destination' ? 1.01 : 1 }}
              className={`flex items-center h-14 w-full rounded-2xl border transition-all relative z-10 ${
                activeField === 'destination' 
                  ? 'border-accent/50 bg-white shadow-premium ring-4 ring-accent/5' 
                  : 'border-white/5 bg-surface-container/40'
              } overflow-hidden`}
            >
              <div className="size-12 shrink-0 flex items-center justify-center">
                 <div className="size-3 bg-accent rounded-full shadow-sm border-2 border-white"></div>
              </div>
              <input
                placeholder="Enter destination"
                autoFocus
                value={destination.query}
                onFocus={() => { setActiveField('destination'); setResults([]); setIsMapSelectionMode(false); }}
                onChange={(e) => dispatch(setDestination({ query: e.target.value, marker: null }))}
                className={`flex-1 bg-transparent border-none outline-none focus:ring-0 font-bold placeholder:font-medium text-base p-0 transition-colors ${
                  activeField === 'destination' ? 'text-slate-900 placeholder:text-slate-400' : 'text-on-surface placeholder:text-on-surface/20'
                }`}
              />
              {destination.query && (
                <button onClick={() => dispatch(setDestination({ query: '', marker: null }))} className={`size-12 flex items-center justify-center transition-colors ${activeField === 'destination' ? 'text-slate-400 hover:text-slate-600' : 'text-on-surface/20 hover:text-on-surface'}`}>
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Search Results Overlay (Inside Card for better containment) */}
          <AnimatePresence>
            {results.length > 0 && !isMapSelectionMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/5 max-h-[300px] overflow-y-auto no-scrollbar"
              >
                {results.map((r, i) => (
                  <motion.div 
                    key={i} 
                    custom={i}
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleSelect(r)}
                    className="px-5 py-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 flex items-start gap-4 transition-colors"
                  >
                    <div className="size-10 rounded-xl bg-surface-bright/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary/60 text-xl">location_on</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-black text-on-surface truncate tracking-tight">{r.properties.name || r.properties.label}</span>
                      <span className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-wider truncate mt-0.5 opacity-60">{r.properties.label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Map Selection Toggle (Floating under card) */}
        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMapSelection}
            className={`flex items-center gap-2 text-[10px] px-6 py-3 rounded-full font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-premium ${
              isMapSelectionMode 
                ? 'bg-accent text-white shadow-teal-glow ring-2 ring-white/20' 
                : 'glass-surface text-primary hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] font-black">{isMapSelectionMode ? 'close' : 'map'}</span>
            {isMapSelectionMode ? 'Cancel Selection' : 'Pin on map'}
          </motion.button>
        </div>
      </div>

      {/* INTERACTIVE OVERLAYS */}
      <AnimatePresence>
        {isMapSelectionMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-5xl text-accent animate-bounce">location_on</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-4 bg-accent/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERGONOMIC CONTROLS (BOTTOM) */}
      <div className="fixed bottom-8 left-0 right-0 z-50 px-6 flex justify-between items-end">
        {/* Recenter Control */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-14 flex items-center justify-center rounded-2xl glass-surface shadow-premium text-primary transition-all active:scale-90"
          onClick={() => {
            if (activeField === 'pickup' && pickup.marker) setMapCenter(pickup.marker.position);
            else if (activeField === 'destination' && destination.marker) setMapCenter(destination.marker.position);
            else if (mapMarkers.length > 0) setMapCenter(mapMarkers[0].position);
          }}
        >
          <span className="material-symbols-outlined font-black text-2xl">my_location</span>
        </motion.button>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => destination.marker ? navigate('/ride-details') : alert('Please select a destination first')}
          className={`h-18 px-10 flex items-center justify-center rounded-pill shadow-premium transition-all gap-4 border-b-4 ${
            destination.marker 
              ? 'teal-pulse-gradient text-on-background border-accent-hover shadow-teal-glow' 
              : 'glass-surface text-on-surface-variant border-white/5 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-base font-black uppercase tracking-[0.2em]">{destination.marker ? 'Confirm' : 'Select Destination'}</span>
          <span className="material-symbols-outlined font-black text-2xl">arrow_forward</span>
        </motion.button>
      </div>

      {/* Selection Hint */}
      <AnimatePresence>
        {isMapSelectionMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 glass-surface text-primary px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] z-50 shadow-teal-glow flex items-center gap-4 border border-white/20"
          >
            <div className="size-2 bg-accent rounded-full animate-ping"></div>
            Tap map for {activeField}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
