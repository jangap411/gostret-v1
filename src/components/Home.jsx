import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { locationService } from '../services/location';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
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
      className="relative flex size-full h-full flex-col bg-background justify-between group/design-root overflow-hidden font-body"
    >
      {/* FULL SCREEN MAP */}
      <MapView center={mapCenter} zoom={mapZoom} className="absolute inset-0 w-full h-full z-0" />

      {/* DEPTH OVERLAYS */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900/10 to-transparent z-[1] pointer-events-none"></div>

      {/* ERGONOMIC CONTROLS */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 cursor-pointer group" 
          onClick={() => setShowSosModal(true)}
        >
          <div className="size-14 bg-accent rounded-full shadow-premium text-white flex items-center justify-center border border-white/20">
            <span className="material-symbols-outlined text-2xl font-black">sos</span>
          </div>
          <div className="glass-surface px-3 py-1 rounded-lg shadow-sm text-[9px] font-black text-primary tracking-widest border border-white/40 uppercase">Safety</div>
        </motion.div>
      </div>

      <div className="absolute top-6 right-6 z-20 flex flex-col gap-4">
        <div className="flex flex-col items-center glass-surface rounded-[24px] shadow-premium overflow-hidden border border-white/20">
          <button className="size-12 flex items-center justify-center border-b border-white/20 hover:bg-white/40 text-primary transition-all active:scale-90">
            <span className="material-symbols-outlined text-xl font-black">north</span>
          </button>
          <button onClick={handleLocateMe} className="size-12 flex items-center justify-center hover:bg-white/40 text-primary transition-all active:scale-90">
            <span className="material-symbols-outlined text-xl font-black">my_location</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE BOTTOM SHEET */}
      <div className="absolute bottom-0 w-full z-30 flex flex-col pointer-events-none px-4 pb-8">
        <motion.div 
          layout
          initial={false}
          animate={isSheetExpanded ? "expanded" : "collapsed"}
          variants={{
            collapsed: { height: 'auto' },
            expanded: { height: '400px' }
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-surface rounded-[48px] shadow-premium p-8 pt-6 pointer-events-auto flex flex-col border border-white/20 overflow-hidden relative"
        >
          {/* Animated Background Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          
          {/* SHEET HANDLE */}
          <button 
            className="w-full flex justify-center pb-8 group/handle" 
            onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full group-hover/handle:bg-slate-200 transition-colors"></div>
          </button>
          
          <AnimatePresence mode="wait">
            {!isSheetExpanded ? (
              <motion.div 
                key="collapsed-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center pb-2 cursor-pointer relative z-10"
                onClick={() => setIsSheetExpanded(true)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-5xl font-black tracking-tighter leading-none">
                    <span className="text-primary">Go</span><span className="text-accent">Stret</span>
                  </h1>
                  <span className="text-4xl">⚽</span>
                </div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Tap to plan your journey</p>
              </motion.div>
            ) : (
              <motion.div 
                key="expanded-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col relative z-10"
              >
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-3xl font-black text-primary tracking-tighter">Plan your ride</h2>
                   <span className="text-2xl">🥎</span>
                </div>
                
                <div className="space-y-6 relative">
                  {/* Visual Route Line */}
                  <div className="absolute left-[26px] top-10 bottom-10 w-0.5 bg-slate-100/50"></div>

                  {/* Pickup Target */}
                  <motion.div 
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/search-location')}
                    className="h-18 w-full bg-slate-50/50 border border-border-subtle shadow-sm rounded-3xl flex items-center gap-5 px-6 group/input hover:border-primary hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="size-3 bg-primary rounded-full ring-4 ring-white shadow-sm shrink-0"></div>
                    <span className="text-primary font-bold text-lg opacity-40 group-hover/input:opacity-100 transition-opacity">Pickup location</span>
                  </motion.div>

                  {/* Destination Target */}
                  <motion.div 
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/search-location')}
                    className="h-18 w-full bg-slate-50/50 border border-border-subtle shadow-sm rounded-3xl flex items-center gap-5 px-6 group/input hover:border-accent hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="size-3 bg-accent rounded-full ring-4 ring-white shadow-sm shrink-0"></div>
                    <span className="text-primary font-bold text-lg opacity-40 group-hover/input:opacity-100 transition-opacity">Where to?</span>
                  </motion.div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/search-location')}
                  className="mt-10 w-full h-18 bg-accent text-white font-black rounded-[28px] shadow-premium text-xl tracking-tight border-b-4 border-accent-hover"
                >
                  Search Destinations
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* PREMIUM SOS MODAL */}
      <AnimatePresence>
        {showSosModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-[48px] p-10 w-full max-w-sm flex flex-col items-center shadow-premium border border-white/20 text-center gap-6"
            >
              <div className="size-24 bg-accent/10 rounded-[32px] flex items-center justify-center text-accent shadow-inner relative">
                <span className="material-symbols-outlined text-5xl font-black">sos</span>
                <span className="absolute inset-0 size-full bg-accent/20 rounded-[32px] animate-ping"></span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-primary tracking-tighter">Emergency Support</h2>
                <p className="text-slate-500 font-bold text-sm mt-3 leading-relaxed opacity-80">Do you need immediate help? This will alert our 24/7 security team and your location will be sent to authorities.</p>
              </div>
              
              <div className="flex flex-col w-full gap-4 mt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { window.location.href='tel:111'; setShowSosModal(false); }}
                  className="w-full h-18 bg-accent text-white font-black rounded-[24px] flex items-center justify-center gap-3 shadow-premium text-lg border-b-4 border-accent-hover"
                >
                  <span className="material-symbols-outlined font-black">call</span>
                  Call Police (111)
                </motion.button>
                <button 
                  onClick={() => setShowSosModal(false)}
                  className="w-full h-14 text-slate-400 font-black text-[10px] tracking-[0.25em] uppercase"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
