import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
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
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const data = await rideService.getRideHistory(token);
        setRides(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'cancelled': return 'text-error bg-error/10 border-error/20';
      case 'in_progress': return 'text-info bg-info/10 border-info/20';
      case 'accepted': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
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
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-background justify-between group/design-root overflow-x-hidden font-body"
    >
      <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24">
        {/* Sticky Header with Glassmorphism */}
        <div className="glass-surface flex items-center p-4 justify-between sticky top-0 z-50 border-b border-white/20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => selectedRide ? setSelectedRide(null) : navigate('/')}
            className="text-primary flex size-11 shrink-0 items-center justify-center hover:bg-white/40 transition-colors rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </motion.button>
          <h2 className="text-primary text-xl font-black leading-tight tracking-tighter flex-1 text-center pr-11">
            {selectedRide ? 'Trip Details' : 'Activity'}
          </h2>
        </div>
        
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-32 gap-6"
             >
               <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
               <p className="text-slate-400 font-black text-xs uppercase tracking-[0.25em]">Fetching History...</p>
             </motion.div>
          ) : !selectedRide ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <span className="text-5xl opacity-40">🚗</span>
                  </div>
                  <h3 className="text-primary text-xl font-black tracking-tight">No rides yet</h3>
                  <p className="text-slate-500 text-sm mt-2 mb-8 leading-relaxed font-medium">You haven't taken any trips yet.<br/>Book your first GoStret ride today!</p>
                </div>
              ) : (
                Object.keys(groupedRides).map(month => (
                  <React.Fragment key={month}>
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] px-6 pb-2 pt-8 opacity-60">{month}</h3>
                    <div className="flex flex-col gap-1 px-4 mt-2">
                      {groupedRides[month].map((ride, idx) => (
                        <motion.div 
                          key={ride.id} 
                          custom={idx}
                          initial="hidden"
                          animate="visible"
                          variants={listItemVariants}
                          whileHover={{ scale: 1.01, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRide(ride)}
                          className="flex items-center gap-4 bg-surface px-4 min-h-[88px] py-4 justify-between cursor-pointer rounded-2xl border border-border-subtle transition-all hover:border-accent/30 hover:shadow-premium group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="text-primary flex items-center justify-center rounded-2xl bg-slate-50 shrink-0 size-14 border border-slate-100 group-hover:bg-accent/5 transition-colors">
                              <span className="material-symbols-outlined text-accent text-2xl">directions_car</span>
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                              <p className="text-primary text-base font-black leading-tight truncate tracking-tight">{ride.destination_address}</p>
                              <p className="text-slate-500 text-[11px] font-bold mt-1 tracking-tight">
                               {new Date(ride.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · PGK {ride.fare}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                             <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(ride.status)} shadow-sm`}>
                               {ride.status.replace('_', ' ')}
                             </span>
                             <span className="material-symbols-outlined text-slate-300 group-hover:text-accent transition-colors">chevron_right</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </React.Fragment>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col px-4 pt-4 pb-12"
            >
              <div className="bg-surface rounded-[32px] shadow-premium border border-border-subtle overflow-hidden mb-8">
                <div className="h-44 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-accent)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="z-10 glass-surface px-5 py-2.5 rounded-full border border-white/40 flex items-center gap-2.5 shadow-sm">
                    <div className="size-2.5 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Trip Summary</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-3xl font-black text-primary tracking-tighter">PGK {selectedRide.fare}</h4>
                      <p className="text-slate-500 text-xs font-bold tracking-tight mt-1 opacity-80">
                        {new Date(selectedRide.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl border ${getStatusColor(selectedRide.status)} shadow-sm`}>
                       <p className="text-[10px] font-black uppercase tracking-[0.15em]">{selectedRide.status.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col relative pl-8 gap-8 my-4">
                    <div className="absolute left-[3px] top-[12px] bottom-[12px] w-[3px] bg-slate-100 flex flex-col items-center rounded-full">
                       <div className="size-3 -mt-1.5 bg-primary rounded-full absolute top-0 border-2 border-white shadow-sm"></div>
                       <div className="size-3 -mb-1.5 bg-accent rounded-full absolute bottom-0 border-2 border-white shadow-sm"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none mb-2 opacity-60">Pickup</p>
                      <p className="text-primary font-bold text-[15px] leading-snug tracking-tight">{selectedRide.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none mb-2 opacity-60">Destination</p>
                      <p className="text-primary font-bold text-[15px] leading-snug tracking-tight">{selectedRide.destination_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-6 rounded-[24px] border border-border-subtle shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-60">Distance</p>
                    <p className="text-primary font-black text-xl tracking-tighter">{selectedRide.distance || '--'}</p>
                  </div>
                  <div className="bg-surface p-6 rounded-[24px] border border-border-subtle shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-60">Duration</p>
                    <p className="text-primary font-black text-xl tracking-tighter">{selectedRide.duration || '--'}</p>
                  </div>
                </div>

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
                      alert('Failed to send receipt: ' + error.message);
                    } finally {
                      setSendingReceipt(false);
                    }
                  }}
                  disabled={sendingReceipt}
                  className={`mt-4 w-full h-16 bg-surface border-2 border-border-subtle text-primary font-black rounded-2xl shadow-premium hover:bg-slate-50 transition-all flex items-center justify-center gap-3 ${sendingReceipt ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {sendingReceipt ? (
                    <><div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" /> <span className="text-xs uppercase tracking-widest">Sending...</span></>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-accent">receipt_long</span>
                      <span className="text-[15px] tracking-tight">View Receipt</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
