import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPickup, setDestination } from '../store/rideSlice';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function SearchLocation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const pickup = useSelector((state) => state.ride.pickup);
  const destination = useSelector((state) => state.ride.destination);

  const [activeField, setActiveField] = useState('destination'); // 'pickup' or 'destination'
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [results, setResults] = useState([]);
  const [isMapSelectionMode, setIsMapSelectionMode] = useState(false);

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeQuery === 'Current location' || activeQuery === 'Selected on map' || isMapSelectionMode) {
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

  const handleMapClick = (e) => {
    if (!isMapSelectionMode) return;
    const { lat, lng } = e.latlng;
    setMapCenter([lat, lng]);
    const newMarker = { position: [lat, lng], popup: 'Selected on map' };
    
    if (activeField === 'pickup') {
      dispatch(setPickup({ query: 'Selected on map', marker: newMarker }));
    } else {
      dispatch(setDestination({ query: 'Selected on map', marker: newMarker }));
    }
    setIsMapSelectionMode(false);
  };

  const mapMarkers = [];
  if (pickup.marker) mapMarkers.push({ ...pickup.marker, popup: 'Pickup: ' + pickup.marker.popup });
  if (destination.marker) mapMarkers.push({ ...destination.marker, popup: 'Destination: ' + destination.marker.popup });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between relative z-50">
          <button onClick={() => navigate(-1)} className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full cursor-pointer" data-icon="List" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Where to?</h2>
        </div>

        <div className="px-4 flex flex-col gap-3 py-3 w-full max-w-[600px] mx-auto relative z-50">
          
          {/* Pickup Input */}
          <label className={`flex flex-col min-w-40 h-14 w-full group relative shadow-sm transition ${activeField === 'pickup' ? 'shadow-md shadow-neutral-200' : ''}`}>
            <div className={`flex w-full flex-1 items-stretch rounded-xl h-full border ${activeField === 'pickup' ? 'border-neutral-800 bg-white' : 'border-transparent group-hover:border-neutral-300 bg-[#ededed]'} overflow-hidden transition-colors`}>
              <div className="text-neutral-500 flex border-none items-center justify-center pl-4 pr-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="40"></circle>
                </svg>
              </div>
              <input
                placeholder="Pickup location"
                value={pickup.query}
                onFocus={() => { setActiveField('pickup'); setResults([]); setIsMapSelectionMode(false); }}
                onChange={(e) => {
                  dispatch(setPickup({ query: e.target.value, marker: null }));
                }}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal transition"
              />
            </div>
          </label>

          {/* Destination Input */}
          <div className="relative w-full">
            <label className={`flex flex-col min-w-40 h-14 w-full group shadow-sm transition ${activeField === 'destination' ? 'shadow-md shadow-neutral-200' : ''}`}>
              <div className={`flex w-full flex-1 items-stretch rounded-xl h-full border ${activeField === 'destination' ? 'border-neutral-800 bg-white' : 'border-transparent group-hover:border-neutral-300 bg-[#ededed]'} overflow-hidden transition-colors`}>
                <div className="text-neutral-500 flex border-none items-center justify-center pl-4 pr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Enter destination"
                  autoFocus
                  value={destination.query}
                  onFocus={() => { setActiveField('destination'); setResults([]); setIsMapSelectionMode(false); }}
                  onChange={(e) => {
                    dispatch(setDestination({ query: e.target.value, marker: null }));
                  }}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal transition"
                />
              </div>
            </label>
            
            {results.length > 0 && !isMapSelectionMode && (
              <ul className="absolute top-16 left-0 w-full bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                {results.map((r, i) => (
                  <li 
                    key={i} 
                    onClick={() => handleSelect(r)}
                    className="px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0 text-sm"
                  >
                    <span className="block font-medium text-[#141414] truncate">{r.properties.name || r.properties.label}</span>
                    {r.properties.region && <span className="block text-neutral-500 text-xs truncate mt-0.5">{r.properties.label}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="flex justify-end mt-1">
            <button
              onClick={toggleMapSelection}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition cursor-pointer shadow-sm active:scale-95 ${isMapSelectionMode ? 'bg-[#141414] text-white shadow-md' : 'bg-white border border-neutral-200 text-[#141414] hover:bg-neutral-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path>
              </svg>
              {isMapSelectionMode ? 'Cancel Map Selection' : 'Pin on map'}
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 pb-4 relative z-0 mt-2">
          <div className="flex flex-1 flex-col px-4 h-full">
            <div className={`relative flex min-h-[220px] flex-1 flex-col justify-between rounded-2xl overflow-hidden shadow-inner object-cover bg-neutral-200 transition-all ${isMapSelectionMode ? 'ring-2 ring-[#D9483E]' : ''}`}>
              
              <MapView 
                center={mapCenter} 
                zoom={14} 
                markers={mapMarkers}
                onMapClick={handleMapClick}
                className={`absolute inset-0 w-full h-full z-0 transition-opacity ${isMapSelectionMode ? 'cursor-crosshair' : ''}`}
              />

              {isMapSelectionMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#141414]/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium z-10 shadow-lg pointer-events-none flex items-center gap-2 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
                  </svg>
                  Tap anywhere on map for {activeField === 'pickup' ? 'pickup' : 'destination'}
                </div>
              )}

              <div className="flex flex-col items-end gap-3 self-end mt-auto mb-4 mr-4 pointer-events-none relative z-10">
                <button className="flex size-12 pointer-events-auto items-center justify-center rounded-full bg-white shadow-[0_4px_12_rgba(0,0,0,0.15)] hover:bg-neutral-50 transition mt-2 cursor-pointer" onClick={() => {
                  if (activeField === 'pickup' && pickup.marker) setMapCenter(pickup.marker.position);
                  else if (activeField === 'destination' && destination.marker) setMapCenter(destination.marker.position);
                  else if (mapMarkers.length > 0) setMapCenter(mapMarkers[0].position);
                }}>
                  <div className="text-[#141414]" data-icon="NavigationArrow" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" transform="scale(-1, 1)">
                      <path d="M229.33,98.21,53.41,33l-.16-.05A16,16,0,0,0,32.9,53.25a1,1,0,0,0,.05.16L98.21,229.33A15.77,15.77,0,0,0,113.28,240h.3a15.77,15.77,0,0,0,15-11.29l23.56-76.56,76.56-23.56a16,16,0,0,0,.62-30.38ZM224,113.3l-76.56,23.56a16,16,0,0,0-10.58,10.58L113.3,224h0l-.06-.17L48,48l175.82,65.22.16.06Z"></path>
                    </svg>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto z-10 relative">
        <div className="flex justify-end px-5 pb-5">
          <button
            onClick={() => destination.query ? navigate('/ride-details') : alert('Please select a destination first')}
            className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 w-16 shadow-lg text-neutral-50 text-base font-bold transition hover:scale-105 hover:shadow-xl ${destination.marker ? 'bg-[#D9483E] text-[#1c170d]' : 'bg-[#141414]'}`}
          >
            <div className={destination.marker ? 'text-[#1c170d]' : 'text-neutral-50'} data-icon="Target" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
