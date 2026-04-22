import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { locationService } from '../services/location';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

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
      className="relative flex size-full h-full flex-col bg-background justify-between group/design-root overflow-hidden font-body"
    >
      {/* Full Screen Map behind overlays */}
      <MapView center={mapCenter} zoom={mapZoom} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Left Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setShowSosModal(true)}>
          <button className="flex items-center justify-center w-12 h-12 bg-accent rounded-full shadow-premium text-white hover:bg-accent-hover group-hover:scale-105 transition-all border border-white/20">
            <span className="material-symbols-outlined text-2xl font-bold">sos</span>
          </button>
          <div className="glass-surface px-2 py-1 rounded-lg shadow-sm text-[10px] font-black text-primary group-hover:shadow-md transition-all tracking-widest">SOS</div>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-4 items-center">
        <div className="flex flex-col items-center glass-surface rounded-2xl shadow-premium overflow-hidden w-11">
          <button className="flex items-center justify-center h-11 w-full border-b border-white/20 hover:bg-white/40 text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">north</span>
          </button>
          <button onClick={handleLocateMe} className="flex items-center justify-center h-11 w-full hover:bg-white/40 text-primary cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-xl">my_location</span>
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
            expanded: { height: '400px' }
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="bg-surface rounded-t-[40px] shadow-[0_-12px_48px_rgba(0,0,0,0.12)] pt-4 pb-8 px-6 pointer-events-auto flex flex-col mb-0 border-t border-white/20"
        >
          {/* Drag Handle - Clickable */}
          <div 
            className="w-full flex justify-center pb-6 cursor-pointer" 
            onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"></div>
          </div>
          
          <AnimatePresence mode="wait">
            {!isSheetExpanded ? (
              <motion.div 
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col cursor-pointer pb-2 items-center text-center"
                onClick={() => setIsSheetExpanded(true)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-primary">Go</span><span className="text-accent">Stret</span>
                  </h1>
                  <span className="text-3xl drop-shadow-sm">🥎</span>
                </div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-80">Tap here to plan your ride</p>
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
                <h2 className="text-2xl font-black text-primary mb-8 tracking-tight">Plan your ride</h2>
                
                {/* Two inputs */}
                <div className="w-full flex relative">
                  <div className="flex flex-col items-center mr-4 mt-5 absolute left-0 top-0 bottom-8">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full z-10 shadow-sm border-2 border-white"></div>
                    <div className="w-0.5 flex-1 bg-slate-100 my-1"></div>
                    <div className="w-2.5 h-2.5 bg-accent rounded-full z-10 shadow-sm border-2 border-white"></div>
                  </div>
                  <div className="flex-1 pl-8">
                    {/* Container for input */}
                    <div className="h-16 w-full border border-border-subtle shadow-sm rounded-2xl flex items-center px-5 mb-4 hover:border-accent hover:shadow-md transition-all bg-slate-50/50 group/input overflow-hidden">
                      <input 
                        placeholder="Pickup location" 
                        className="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-primary font-bold placeholder:font-medium placeholder:text-slate-400 cursor-pointer p-0" 
                        onClick={() => navigate('/search-location')}
                        readOnly
                      />
                    </div>
                    <div className="h-16 w-full border border-border-subtle shadow-sm rounded-2xl flex items-center px-5 mb-2 hover:border-accent hover:shadow-md transition-all bg-slate-50/50 group/input overflow-hidden">
                      <input 
                        placeholder="Destination" 
                        className="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-primary font-bold placeholder:font-medium placeholder:text-slate-400 cursor-pointer p-0" 
                        onClick={() => navigate('/search-location')}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/search-location')}
                  className="mt-8 w-full h-16 bg-accent text-white font-black rounded-2xl shadow-premium hover:bg-accent-hover transition-all active:scale-[0.98] tracking-tight text-lg border-b-4 border-accent-hover"
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
            className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center shadow-premium border border-white/20"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-accent shadow-inner">
                <span className="material-symbols-outlined text-4xl font-bold">sos</span>
              </div>
              <h2 className="text-2xl font-black text-primary mb-3 text-center tracking-tighter">Emergency Assistance</h2>
              <p className="text-center text-slate-500 mb-10 text-sm leading-relaxed font-medium">Do you need immediate help? This will connect you directly to emergency services and alert our security team.</p>
              
              <div className="flex flex-col w-full gap-4">
                <button 
                  onClick={() => { window.location.href='tel:111'; setShowSosModal(false); }}
                  className="w-full h-16 bg-accent text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-accent-hover shadow-premium active:scale-95 transition-all text-lg border-b-4 border-accent-hover"
                >
                  <span className="material-symbols-outlined">call</span>
                  Call Police (111)
                </button>
                <button 
                  onClick={() => setShowSosModal(false)}
                  className="w-full h-14 bg-slate-100 text-primary font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 text-md"
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
