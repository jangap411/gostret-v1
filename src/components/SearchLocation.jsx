import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function SearchLocation() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [marker, setMarker] = useState(null);

  const searchLocation = async (text) => {
    try {
      // Hardcoded to avoid Vite server restart requirement
      const apiKey = '5b3ce3597851110001cf62484036c6ff02874ec688671f7a883449e0';
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
      if (query.trim().length > 2 && !marker) {
        searchLocation(query);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, marker]);

  const handleSelect = (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    let label = feature.properties.label || feature.properties.name;
    setMapCenter([lat, lon]);
    setMarker({ position: [lat, lon], popup: label });
    setQuery(label);
    setResults([]);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
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

        {/* Inputs */}
        <div className="px-4 flex flex-col gap-3 py-3 w-full max-w-[600px] mx-auto relative z-50">
          <label className="flex flex-col min-w-40 h-14 w-full group relative shadow-sm hover:shadow-md transition">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-transparent group-hover:border-neutral-300 overflow-hidden bg-[#ededed]">
              <div
                className="text-neutral-500 flex border-none items-center justify-center pl-4 pr-2"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="40"></circle>
                </svg>
              </div>
              <input
                placeholder="Current location"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal transition"
                defaultValue="Current Location"
              />
            </div>
          </label>
          <div className="relative w-full">
            <label className="flex flex-col min-w-40 h-14 w-full group shadow-sm hover:shadow-md transition">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-transparent group-focus-within:border-neutral-800 overflow-hidden bg-[#ededed]">
                <div
                  className="text-neutral-500 flex border-none items-center justify-center pl-4 pr-2"
                  data-icon="MagnifyingGlass" data-size="24px" data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Enter destination"
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setMarker(null); // Clear marker on edit
                  }}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal transition"
                />
              </div>
            </label>
            
            {/* Search Results Dropdown */}
            {results.length > 0 && (
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
        </div>

        {/* Map Area */}
        <div className="flex flex-col flex-1 pb-4 relative z-0">
          <div className="flex flex-1 flex-col px-4 h-full">
            <div className="relative flex min-h-[320px] flex-1 flex-col justify-between rounded-2xl overflow-hidden shadow-inner object-cover bg-neutral-200">
              
              <MapView 
                center={mapCenter} 
                zoom={14} 
                markers={marker ? [marker] : []}
                className="absolute inset-0 w-full h-full z-0"
              />

              <div className="flex flex-col items-end gap-3 self-end mt-auto mb-4 mr-4 pointer-events-none relative z-10">
                <button className="flex size-12 pointer-events-auto items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-neutral-50 transition mt-2 cursor-pointer" onClick={() => {
                  if(marker) setMapCenter(marker.position);
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
            onClick={() => marker ? navigate('/ride-details') : alert('Please select a destination first')}
            className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 w-16 shadow-lg text-neutral-50 text-base font-bold transition hover:scale-105 hover:shadow-xl ${marker ? 'bg-[#f4c653] text-[#1c170d]' : 'bg-[#141414]'}`}
          >
            <div className={marker ? 'text-[#1c170d]' : 'text-neutral-50'} data-icon="Target" data-size="24px" data-weight="regular">
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
