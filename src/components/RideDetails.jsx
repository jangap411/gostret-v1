import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function RideDetails() {
  const navigate = useNavigate();
  const pickup = useSelector((state) => state.ride.pickup);
  const destination = useSelector((state) => state.ride.destination);

  const [route, setRoute] = useState(null);
  const [routeMeta, setRouteMeta] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (pickup?.marker?.position && destination?.marker?.position) {
        setLoadingRoute(true);
        try {
          const apiKey = '5b3ce3597851110001cf62484036c6ff02874ec688671f7a883449e0';
          const [lat1, lon1] = pickup.marker.position;
          const [lat2, lon2] = destination.marker.position;
          
          const res = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`);
          const data = await res.json();
          
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            // ORS returns [lon, lat], Leaflet wants [lat, lon]
            const coords = feature.geometry.coordinates.map(c => [c[1], c[0]]);
            setRoute(coords);
            
            const { distance, duration } = feature.properties.summary;
            // distance is in meters, duration in seconds
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

  const mapMarkers = [];
  if (pickup?.marker) mapMarkers.push({ ...pickup.marker, popup: 'Pickup' });
  if (destination?.marker) mapMarkers.push({ ...destination.marker, popup: 'Destination' });

  const mapCenter = destination?.marker?.position || pickup?.marker?.position || [-9.43869006941101, 147.1810054779053];

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
      <div>
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between relative z-50">
          <button onClick={() => navigate(-1)} className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Ride details</h2>
        </div>
        
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 relative z-50">
          <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#D9483E" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="40"></circle>
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-sm font-bold uppercase tracking-wider opacity-60">Pickup</p>
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
              {pickup?.query || 'Not selected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 relative z-50">
          <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-sm font-bold uppercase tracking-wider opacity-60">Destination</p>
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
              {destination?.query || 'Not selected'}
            </p>
          </div>
        </div>

        <div className="flex px-4 py-3">
          <div className="w-full aspect-square rounded-2xl overflow-hidden relative z-0 border-2 border-neutral-200/50 shadow-md">
            <MapView 
              center={mapCenter} 
              zoom={13} 
              markers={mapMarkers} 
              route={route}
              routeMeta={routeMeta}
              className="absolute inset-0 w-full h-full z-0" 
            />
            {loadingRoute && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20 flex items-center justify-center">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-xl">
                  <div className="w-5 h-5 border-2 border-[#D9483E] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[#141414] font-bold text-sm">Calculating route...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Ride options</h3>
        <div className="overflow-y-auto max-h-[250px] scrollbar-hide pb-2">
          {[
            { id: 'uberx', name: 'GoStret Regular', time: '4 min', price: '$12.34', icon: 'Car' },
            { id: 'uberxl', name: 'GoStret Premium', time: '6 min', price: '$18.51', icon: 'Car' },
            { id: 'comfort', name: 'GoStret XL', time: '8 min', price: '$22.78', icon: 'Car' }
          ].map((option) => (
            <div key={option.id} className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 justify-between hover:bg-neutral-100 cursor-pointer transition-colors duration-200 active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="text-[#141414] flex items-center justify-center rounded-lg bg-white border border-neutral-200 shrink-0 size-12 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#141414] text-base font-bold leading-normal">{option.name}</p>
                  <p className="text-neutral-500 text-sm font-normal leading-normal">{option.time} wait · Friendly drivers</p>
                </div>
              </div>
              <div className="shrink-0"><p className="text-[#141414] text-lg font-bold leading-normal">{option.price}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-t border-neutral-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex px-4 py-4">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-5 flex-1 bg-[#D9483E] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-red-200 active:scale-95 transition-transform"
          >
            <span className="truncate">Book GoStret Regular</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
