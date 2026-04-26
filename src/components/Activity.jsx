import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRideHistory } from '../hooks/useRides';
import { rideService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export default function Activity() {
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);

  const { data: rides = [], isLoading: loading } = useRideHistory();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'cancelled': return 'text-error bg-error/10 border-error/20';
      case 'in_progress': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  const groupedRides = rides.reduce((acc, ride) => {
    const date = new Date(ride.created_at);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(ride);
    return acc;
  }, {});

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-background text-primary font-body h-full flex flex-col relative overflow-hidden"
    >
      {/* PREMIUM HEADER - GLASSMORPHISM */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => selectedRide ? setSelectedRide(null) : navigate('/')}
          className="size-11 rounded-2xl bg-surface border border-white/20 flex items-center justify-center text-slate-400 shadow-sm"
        >
          <span className="material-symbols-outlined font-black">
            {selectedRide ? 'arrow_back' : 'home'}
          </span>
        </motion.button>
        <h2 className="text-sm font-black tracking-[0.2em] uppercase text-primary">
          {selectedRide ? 'TRIP DETAILS' : 'ACTIVITY'}
        </h2>
        <div className="size-11"></div>
      </header>

      <main className="flex-1 pt-24 pb-32 px-6 overflow-y-auto no-scrollbar max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-32 gap-6"
             >
               <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.25em] opacity-60">Synchronizing...</p>
             </motion.div>
          ) : !selectedRide ? (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
                  <div className="size-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner border border-slate-100">
                    <span className="material-symbols-outlined text-4xl text-slate-200">history</span>
                  </div>
                  <h3 className="text-primary text-xl font-black tracking-tighter">No activity found</h3>
                  <p className="text-slate-400 text-xs font-bold mt-3 leading-relaxed opacity-80">Your completed trips will appear here.<br/>Ready to start your first journey?</p>
                </div>
              ) : (
                Object.keys(groupedRides).map(month => (
                  <section key={month}>
                    <div className="flex items-center justify-between mb-5 px-2">
                      <h4 className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">{month}</h4>
                      <div className="size-2 bg-primary/20 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      {groupedRides[month].map((ride, idx) => (
                        <motion.button 
                          key={ride.id} 
                          custom={idx}
                          initial="hidden"
                          animate="visible"
                          variants={listItemVariants}
                          whileHover={{ scale: 1.01, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRide(ride)}
                          className="w-full flex items-center justify-between p-6 bg-surface rounded-[32px] border border-white/20 shadow-premium group transition-all"
                        >
                          <div className="flex items-center gap-5 min-w-0">
                            <div className="size-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-800 transition-colors shrink-0">
                              <span className="material-symbols-outlined font-black text-2xl">directions_car</span>
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-on-surface group-hover:text-white text-base font-black tracking-tight leading-tight truncate transition-colors">{ride.destination_address}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-tight opacity-80">
                                  {new Date(ride.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="size-1 bg-slate-200 rounded-full"></span>
                                <span className="text-slate-400 group-hover:text-white font-black text-[10px] uppercase tracking-tight transition-colors">PGK {ride.fare}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                             <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(ride.status)} shadow-sm`}>
                               {ride.status.replace('_', ' ')}
                             </div>
                             <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* TRIP SUMMARY CARD */}
              <section className="bg-surface rounded-[48px] shadow-premium border border-white/20 overflow-hidden relative">
                <div className="h-48 bg-slate-50/50 relative flex items-center justify-center border-b border-slate-100">
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1D3557_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  <div className="z-10 glass-surface px-6 py-3 rounded-full border border-white/40 flex items-center gap-3 shadow-premium">
                    <div className="size-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Journey Overview</span>
                  </div>
                </div>

                <div className="p-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Total Fare</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-primary opacity-30 uppercase tracking-tighter">PGK</span>
                          <h4 className="text-5xl font-black text-primary tracking-tighter leading-none">{selectedRide.fare}</h4>
                       </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl border ${getStatusColor(selectedRide.status)} shadow-sm`}>
                       <p className="text-[9px] font-black uppercase tracking-[0.2em]">{selectedRide.status.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* ROUTE VISUALIZATION */}
                  <div className="relative pl-10 space-y-12 py-2">
                    <div className="absolute left-[13px] top-10 bottom-10 w-0.5 bg-slate-100/50"></div>

                    {/* Pickup */}
                    <div className="relative z-10 space-y-3">
                      <div className="size-7 rounded-full bg-primary flex items-center justify-center ring-4 ring-white shadow-sm absolute -left-[40px] top-0">
                         <div className="size-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60 leading-none">Pickup Point</p>
                      <p className="text-primary font-bold text-lg leading-snug tracking-tight">{selectedRide.pickup_address}</p>
                    </div>

                    {/* Destination */}
                    <div className="relative z-10 space-y-3">
                      <div className="size-7 rounded-full bg-accent flex items-center justify-center ring-4 ring-white shadow-sm absolute -left-[40px] top-0">
                         <span className="material-symbols-outlined text-[15px] text-white font-black">location_on</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60 leading-none">Destination</p>
                      <p className="text-primary font-bold text-lg leading-snug tracking-tight">{selectedRide.destination_address}</p>
                    </div>
                  </div>
                  
                  <p className="text-center text-slate-300 font-bold text-[10px] uppercase tracking-[0.1em] pt-4 border-t border-slate-50">
                    {new Date(selectedRide.created_at).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </section>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-surface p-7 rounded-[32px] border border-white/20 shadow-sm text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-60">Distance</p>
                  <p className="text-primary font-black text-2xl tracking-tighter">{selectedRide.distance || '--'}</p>
                </div>
                <div className="bg-surface p-7 rounded-[32px] border border-white/20 shadow-sm text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-60">Duration</p>
                  <p className="text-primary font-black text-2xl tracking-tighter">{selectedRide.duration || '--'}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="space-y-4 pt-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    setSendingReceipt(true);
                    try {
                      const token = localStorage.getItem('token');
                      const result = await rideService.sendReceipt(selectedRide.id, token);
                      alert(result.message);
                    } catch (error) {
                      alert('Error: ' + error.message);
                    } finally {
                      setSendingReceipt(false);
                    }
                  }}
                  disabled={sendingReceipt}
                  className="w-full h-18 bg-primary text-white font-black rounded-[28px] shadow-premium flex items-center justify-center gap-4 transition-all disabled:opacity-60 border-b-4 border-slate-900"
                >
                  {sendingReceipt ? (
                    <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined font-black">receipt_long</span>
                      <span className="text-lg tracking-tight">Request Receipt</span>
                    </>
                  )}
                </motion.button>
                
                <button 
                  onClick={() => setSelectedRide(null)}
                  className="w-full h-14 text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase"
                >
                  BACK TO ACTIVITY
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
