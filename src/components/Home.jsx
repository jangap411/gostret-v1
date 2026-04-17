import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

import { locationService } from '../services/location';

export default function Home() {
  const navigate = useNavigate();
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [mapZoom, setMapZoom] = useState(13);

  const handleLocateMe = async () => {
    try {
      const position = await locationService.getCurrentPosition();
      setMapCenter([position.coords.latitude, position.coords.longitude]);
      setMapZoom(16);
      console.log(position);
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to fetch location. Please check your device settings.");
    }
  };

   useEffect(() => {
    handleLocateMe();
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-neutral-100 justify-between group/design-root overflow-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      {/* Full Screen Map behind overlays */}
      <MapView center={mapCenter} zoom={mapZoom} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Left Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setShowSosModal(true)}>
          <button className="flex items-center justify-center w-12 h-12 bg-[#D9483E] rounded-full shadow-md text-white hover:bg-[#c53d34] group-hover:scale-105 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
            </svg>
          </button>
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold text-neutral-800 group-hover:shadow-md transition-shadow">SOS</div>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-4 items-center">
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
          className="bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pt-4 pb-6 px-6 pointer-events-auto flex flex-col mb-0"
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
      </div>

      {/* Interactive SOS Modal Overlay */}
      <AnimatePresence>
        {showSosModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col items-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-[#D9483E]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1D3557] mb-2 text-center tracking-tight">Emergency Assistance</h2>
              <p className="text-center text-neutral-500 mb-8 text-sm">Do you need immediate help? This will connect you directly to emergency services.</p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={() => { window.location.href='tel:111'; setShowSosModal(false); }}
                  className="w-full h-[52px] bg-[#D9483E] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#c53d34] shadow-md hover:shadow-lg transition-all text-[15px]"
                >
                  Call Police (111)
                </button>
                <button 
                  onClick={() => setShowSosModal(false)}
                  className="w-full h-[52px] bg-neutral-100 text-[#1D3557] font-bold rounded-xl hover:bg-neutral-200 transition-colors text-[15px]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
