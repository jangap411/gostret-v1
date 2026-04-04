import BottomNav from './BottomNav';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

export default function Home() {
  const navigate = useNavigate();
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setMapZoom(16);
        },
        (error) => {
          console.warn("Geolocation failed or denied, using default center.", error);
        }
      );
    }
  }, []);

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setMapZoom(16);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-screen flex-col bg-neutral-100 justify-between group/design-root overflow-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      {/* Full Screen Map behind overlays */}
      <MapView center={mapCenter} zoom={mapZoom} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Left Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-[#111518] hover:bg-neutral-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,224,128ZM32,72H224a8,8,0,0,0,0-16H32a8,8,0,0,0,0,16ZM224,184H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16Z"></path>
          </svg>
        </button>
        <div className="flex flex-col items-center gap-1">
          <button className="flex items-center justify-center w-12 h-12 bg-[#D9483E] rounded-full shadow-md text-white hover:bg-[#c53d34] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
            </svg>
          </button>
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold text-neutral-800">SOS</div>
        </div>
      </div>



      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-4 items-center">
        <button onClick={() => navigate('/account')} className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-[#111518] hover:bg-neutral-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
          </svg>
        </button>
        <div className="flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden w-10">
          <button className="flex items-center justify-center h-10 w-full border-b border-neutral-100 hover:bg-neutral-50 text-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,53.66,113l74.34-74.34V216a8,8,0,0,0,16,0V38.69l74.34,74.34a8,8,0,0,0,11.32-11.32Z"></path>
            </svg>
          </button>
          <button onClick={handleLocateMe} className="flex items-center justify-center h-10 w-full hover:bg-neutral-50 text-neutral-600 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Interface Container */}
      <div className="absolute bottom-0 w-full z-20 flex flex-col pointer-events-none">
        
        {/* White Rounded Bottom Sheet overlay */}
        <motion.div 
          animate={isSheetExpanded ? "expanded" : "collapsed"}
          variants={{
            collapsed: { height: 'auto' },
            expanded: { height: '380px' }
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pt-4 pb-6 px-6 pointer-events-auto flex flex-col"
        >
          {/* Drag Handle - Clickable */}
          <div 
            className="w-full flex justify-center pb-4 cursor-pointer" 
            onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          >
            <div className="w-14 h-1.5 bg-neutral-300 rounded-full hover:bg-neutral-400 transition-colors"></div>
          </div>
          
          <AnimatePresence mode="wait">
            {!isSheetExpanded ? (
              <motion.div 
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col cursor-pointer pb-2"
                onClick={() => setIsSheetExpanded(true)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                      <span className="text-[#1D3557]">Go</span><span className="text-[#D9483E]">Stret</span>
                    </h1>
                    <span className="text-2xl">🥎</span>
                  </div>
                  <p className="text-neutral-500 flex font-medium text-sm">Tap here to plan your ride</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="expanded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <h2 className="text-xl font-bold text-[#1D3557] mb-6">Plan your ride</h2>
                
                {/* Two inputs */}
                <div className="w-full flex relative">
                  <div className="flex flex-col items-center mr-3 mt-4 absolute left-0 top-0 bottom-6">
                    <div className="w-[10px] h-[10px] bg-neutral-800 rounded-full z-10 shadow-sm"></div>
                    <div className="w-[2px] flex-1 bg-neutral-200 my-1"></div>
                    <div className="w-[10px] h-[10px] bg-[#D9483E] rounded-full z-10 shadow-sm"></div>
                  </div>
                  <div className="flex-1 pl-6">
                    <div className="h-14 w-full border border-neutral-200 shadow-sm rounded-xl flex items-center px-4 mb-3 hover:border-[#D9483E] transition-colors bg-white">
                      <input 
                        placeholder="Pickup location" 
                        className="w-full bg-transparent outline-none text-[#1c170d] font-medium placeholder:font-normal placeholder:text-neutral-400 cursor-pointer" 
                        onClick={() => navigate('/search-location')}
                        readOnly
                      />
                    </div>
                    <div className="h-14 w-full border border-neutral-200 shadow-sm rounded-xl flex items-center px-4 mb-2 hover:border-[#D9483E] transition-colors bg-white">
                      <input 
                        placeholder="Destination" 
                        className="w-full bg-transparent outline-none text-[#1c170d] font-medium placeholder:font-normal placeholder:text-neutral-400 cursor-pointer" 
                        onClick={() => navigate('/search-location')}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/search-location')}
                  className="mt-6 w-full h-14 bg-[#D9483E] text-white font-bold rounded-xl shadow-md hover:bg-[#c53d34] transition-colors tracking-tight text-lg"
                >
                  Search Destinations
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <BottomNav />
      </div>
    </motion.div>
  );
}
