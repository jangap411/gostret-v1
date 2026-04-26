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
      className="relative flex size-full h-full flex-col bg-background justify-between group/design-root overflow-x-hidden font-body"
    >
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Premium Sticky Header */}
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
            Where to?
          </h2>
        </div>

        <div className="px-4 flex flex-col gap-4 py-6 w-full max-w-[600px] mx-auto relative z-50">
          
          {/* Input Stack with Visual Connector */}
          <div className="relative flex flex-col gap-3">
            <div className="absolute left-[26px] top-[30px] bottom-[30px] w-0.5 bg-slate-100 z-0"></div>
            
            {/* Pickup Input */}
            <motion.div 
              animate={{ scale: activeField === 'pickup' ? 1.02 : 1 }}
              className={`flex items-center h-14 w-full rounded-2xl border transition-all relative z-10 ${
                activeField === 'pickup' 
                  ? 'border-primary bg-white shadow-premium ring-4 ring-primary/5' 
                  : 'border-border-subtle bg-slate-50/50'
              } overflow-hidden`}
            >
              <div className="size-14 shrink-0 flex items-center justify-center">
                 <div className="size-3 bg-primary rounded-full shadow-sm border-2 border-white"></div>
              </div>
              <input
                placeholder="Pickup location"
                value={pickup.query}
                onFocus={() => { setActiveField('pickup'); setResults([]); setIsMapSelectionMode(false); }}
                onChange={(e) => dispatch(setPickup({ query: e.target.value, marker: null }))}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-primary font-bold placeholder:font-medium placeholder:text-slate-400 text-base p-0"
              />
            </motion.div>

            {/* Destination Input */}
            <motion.div 
              animate={{ scale: activeField === 'destination' ? 1.02 : 1 }}
              className={`flex items-center h-14 w-full rounded-2xl border transition-all relative z-10 ${
                activeField === 'destination' 
                  ? 'border-accent bg-white shadow-premium ring-4 ring-accent/5' 
                  : 'border-border-subtle bg-slate-50/50'
              } overflow-hidden`}
            >
              <div className="size-14 shrink-0 flex items-center justify-center">
                 <div className="size-3 bg-accent rounded-full shadow-sm border-2 border-white"></div>
              </div>
              <input
                placeholder="Enter destination"
                autoFocus
                value={destination.query}
                onFocus={() => { setActiveField('destination'); setResults([]); setIsMapSelectionMode(false); }}
                onChange={(e) => dispatch(setDestination({ query: e.target.value, marker: null }))}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-primary font-bold placeholder:font-medium placeholder:text-slate-400 text-base p-0"
              />
            </motion.div>
          </div>

          {/* Map Selection Toggle */}
          <div className="flex justify-end mt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMapSelection}
              className={`flex items-center gap-2 text-xs px-5 py-2.5 rounded-full font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                isMapSelectionMode 
                  ? 'bg-primary text-white shadow-premium' 
                  : 'bg-white border border-border-subtle text-primary hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-black">map</span>
              {isMapSelectionMode ? 'Cancel Selection' : 'Pin on map'}
            </motion.button>
          </div>

          {/* Search Results Overlay */}
          <AnimatePresence>
            {results.length > 0 && !isMapSelectionMode && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-52 left-4 right-4 bg-white border border-border-subtle rounded-3xl shadow-premium overflow-hidden z-[100] max-h-72 overflow-y-auto no-scrollbar border-b-4 border-slate-100"
              >
                {results.map((r, i) => (
                  <motion.div 
                    key={i} 
                    custom={i}
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleSelect(r)}
                    className="px-6 py-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-b-0 flex items-start gap-4 transition-colors"
                  >
                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-400 text-xl">location_on</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-black text-primary truncate tracking-tight">{r.properties.name || r.properties.label}</span>
                      <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate mt-0.5 opacity-80">{r.properties.label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map View Section */}
        <div className="flex-1 px-4 pb-6 relative z-0">
          <div className={`relative flex h-full flex-col rounded-[32px] overflow-hidden shadow-inner bg-slate-100 transition-all border-4 ${isMapSelectionMode ? 'border-accent animate-pulse shadow-premium' : 'border-white'}`}>
            
            <MapView 
              center={mapCenter} 
              zoom={14} 
              markers={mapMarkers}
              userImage={userImage}
              onMapClick={handleMapClick}
              className="absolute inset-0 w-full h-full z-0"
            />

            {/* Map Interaction Hint */}
            <AnimatePresence>
              {isMapSelectionMode && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 glass-surface text-primary px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] z-10 shadow-premium flex items-center gap-3 border border-white/40"
                >
                  <div className="size-2 bg-accent rounded-full animate-ping"></div>
                  Tap map to set {activeField}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recenter Control */}
            <div className="absolute right-4 bottom-4 z-10">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="size-12 pointer-events-auto flex items-center justify-center rounded-2xl bg-white shadow-premium hover:bg-slate-50 transition border border-border-subtle"
                onClick={() => {
                  if (activeField === 'pickup' && pickup.marker) setMapCenter(pickup.marker.position);
                  else if (activeField === 'destination' && destination.marker) setMapCenter(destination.marker.position);
                  else if (mapMarkers.length > 0) setMapCenter(mapMarkers[0].position);
                }}
              >
                <span className="material-symbols-outlined text-primary font-black">my_location</span>
              </motion.button>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6 z-[60]">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          onClick={() => destination.marker ? navigate('/ride-details') : alert('Please select a destination first')}
          className={`size-16 flex items-center justify-center rounded-[24px] shadow-premium transition-all border-b-4 ${
            destination.marker 
              ? 'bg-accent text-white border-accent-hover' 
              : 'bg-primary text-white border-slate-900 opacity-80'
          }`}
        >
          <span className="material-symbols-outlined font-black text-3xl">arrow_forward</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
