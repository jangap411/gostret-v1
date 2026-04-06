import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import MapView from './MapView';
import L from 'leaflet';

const pageVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 }
};

// Custom car icon for simulation
const carIcon = new L.DivIcon({
  html: `<div class="bg-white p-1 rounded-full shadow-lg border-2 border-[#D9483E] animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#D9483E" viewBox="0 0 256 256">
            <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
          </svg>
        </div>`,
  className: 'car-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function RideInProgress() {
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const pickup = useSelector((state) => state.ride.pickup);
  const destination = useSelector((state) => state.ride.destination);

  const [route, setRoute] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [routeIndex, setRouteIndex] = useState(0);
  const simulationInterval = useRef(null);

  // Fetch route and start simulation
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickup?.marker?.position && destination?.marker?.position) {
        try {
          const apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
          const [lat1, lon1] = pickup.marker.position;
          const [lat2, lon2] = destination.marker.position;
          
          const res = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`);
          const data = await res.json();
          
          if (data.features && data.features.length > 0) {
            const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
            setRoute(coords);
            setCurrentPos(coords[0]);
            setRouteIndex(0);
          }
        } catch (error) {
          console.error("Failed to fetch route for simulation", error);
        }
      }
    };

    fetchRoute();
  }, [pickup, destination]);

  // Movement simulation loop
  useEffect(() => {
    if (route && route.length > 0) {
      simulationInterval.current = setInterval(() => {
        setRouteIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < route.length) {
            setCurrentPos(route[nextIndex]);
            return nextIndex;
          } else {
            clearInterval(simulationInterval.current);
            return prevIndex;
          }
        });
      }, 1000); // Move every second
    }

    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [route]);

  const mapMarkers = [];
  if (pickup?.marker) mapMarkers.push({ position: pickup.marker.position, popup: 'Pickup' });
  if (destination?.marker) mapMarkers.push({ position: destination.marker.position, popup: 'Destination' });
  if (currentPos) mapMarkers.push({ position: currentPos, popup: 'Current Location', icon: carIcon });

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
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapView 
            center={currentPos || pickup?.marker?.position || [-9.43869006941101, 147.1810054779053]} 
            zoom={15} 
            markers={mapMarkers}
            route={route}
            className="w-full h-full"
          />
        </div>
        
        {/* Search Overlay */}
        <div className="relative z-10 w-full px-4 pt-4 pointer-events-auto">
          <label className="flex flex-col min-w-40 h-12 shadow-md rounded-xl hover:shadow-lg transition-shadow bg-neutral-50">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full overflow-hidden">
              <div className="text-neutral-500 flex items-center justify-center pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Where to?"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal"
                defaultValue=""
              />
            </div>
          </label>
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-20 flex flex-col gap-2 z-10">
          <div className="flex flex-col rounded-xl overflow-hidden shadow-md bg-white">
            <button className="flex size-10 items-center justify-center hover:bg-neutral-100 transition border-b border-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#141414" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <button className="flex size-10 items-center justify-center hover:bg-neutral-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#141414" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Expandable Bottom Sheet */}
      <motion.div 
        animate={isSheetExpanded ? "expanded" : "collapsed"}
        variants={{
          collapsed: { height: '160px' },
          expanded: { height: '320px' }
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pt-3 pb-6 pointer-events-auto flex flex-col z-20 border-t border-neutral-100"
      >
        <div 
          className="w-full flex justify-center pb-2 cursor-pointer group" 
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
        >
          <div className="w-14 h-1.5 bg-neutral-200 rounded-full group-hover:bg-neutral-300 transition-colors"></div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-5">
            <div 
              className="flex items-center gap-4 py-3 cursor-pointer"
              onClick={() => setIsSheetExpanded(!isSheetExpanded)}
            >
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shadow-sm border-2 border-white ring-1 ring-neutral-100"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCX4MFPG__CP8hv3NREftjc7Xf56xLws6CKcmbiHJK3xvmZjUW02Q34ckm4C4Vm6WwC_78bpqrvb-ASwP8tjd889_wrLEYEnM83inxKtCc_UFsF8AN3HdoYO86EKOGnGrPI3G_KiJklXFA5PaNYQJFZftxUfyXz9qFKFxWDqk8Z0y_tf-7T72mlLeRWvIqa00A7TTZ9VI-ynxZWENRlny0s_qJ7V7XClXp18_k73Vw_xQZKvJOmBx8Q_kiuz7_pXf2QZ2cYh8l9818")' }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-[#141414] text-lg font-bold leading-none">Your ride is in progress</p>
                  <p className="text-[#D9483E] text-sm font-bold">5 min ETA</p>
                </div>
                <p className="text-neutral-500 text-sm font-medium mt-1">Toyota Camry · White</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isSheetExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex-1 flex flex-col"
              >
                <div className="px-5 py-2 border-t border-neutral-50">
                  <div className="flex items-center gap-4 py-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-neutral-100"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2oslRnJMDapk8mUtGAG2ulSySsomThb6FFTIYOgF-loqFxCAL-g903h4rsl-XsPYWEqqlxkGOJyx_U5VWdX0jwBt9mN66iJlWbVPWW5wsaDqwCW-eVxBQcjk_AtpH_a43OZk0zKkPhgTHVY5QHcxX6SsECeqeJFGWUeIWgiGL26a_Jy5QwHdsfBFN0ncWhclkBehTYtlC5QBN_JJa8swOVJPCXWxPUzaFT3vza_JdIDM38ZvGI_25A9uaeH95DeynfGawW5zLXpU")' }}
                    ></div>
                    <div className="flex flex-col justify-center flex-1">
                       <p className="text-[#141414] text-base font-bold">Lucas</p>
                       <p className="text-neutral-500 text-xs font-medium">Top-rated partner</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold border border-yellow-100">
                      <span>4.9</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.07-31-51.07,31a16,16,0,0,1-23.84-17.34L60.6,153.74,15.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.33a16,16,0,0,1,29.44,0l23.21,55.33,59.46,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 px-5 mt-auto">
                    <button className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#D9483E] text-white text-base font-bold shadow-lg shadow-red-100 hover:bg-[#C53D34] transition active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,48H40A16,16,0,0,0,24,64V176a16,16,0,0,0,16,16h40v32a8,8,0,0,0,13.17,6.15l42.47-35,53.49-1.15a16,16,0,0,0,14.87-16V64A16,16,0,0,0,216,48ZM176,136H80a8,8,0,0,1,0-16h96a8,8,0,0,1,0,16Zm0-32H80a8,8,0,0,1,0-16h96a8,8,0,0,1,0,16Z"></path>
                        </svg>
                        Message
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-neutral-100 text-[#1D3557] text-base font-bold border border-neutral-200 hover:bg-neutral-200 transition active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,1,1,0,0,1-.11.08L134.39,153c-18.42-10-33.8-25.39-43.77-43.81l14.28-25.43a1,1,0,0,1,.08-.11,16,16,0,0,0,1.4-15.21l-.06-.13L85.24,21.19a16,16,0,0,0-17.76-9.15,62.06,62.06,0,0,0-48.42,48C17.33,122.35,74.5,179.35,137.33,179.35a62,62,0,0,0,48-19.06,16,16,0,0,0-2.96-21.83Z"></path>
                        </svg>
                        Call
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
