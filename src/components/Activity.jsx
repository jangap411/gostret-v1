import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { rideService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
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
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'accepted': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-neutral-500 bg-neutral-50';
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
      className="relative flex size-full h-full flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex-1 flex flex-col h-full overflow-y-auto pb-20">
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between sticky top-0 z-50">
          <button 
            onClick={() => selectedRide ? setSelectedRide(null) : navigate('/')}
            className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {selectedRide ? 'Trip details' : 'Activity'}
          </h2>
        </div>
        
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-20 gap-4"
             >
               <div className="w-8 h-8 border-4 border-[#D9483E] border-t-transparent rounded-full animate-spin"></div>
               <p className="text-neutral-400 font-bold">Loading your activity...</p>
             </motion.div>
          ) : !selectedRide ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              {rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl text-neutral-300">🚗</span>
                  </div>
                  <h3 className="text-[#1c170d] text-lg font-bold">No rides yet</h3>
                  <p className="text-neutral-500 text-sm mt-1 mb-6">You haven't taken any trips yet. Book your first GoStret ride today!</p>
                </div>
              ) : (
                Object.keys(groupedRides).map(month => (
                  <React.Fragment key={month}>
                    <h3 className="text-[#141414] text-sm font-bold uppercase tracking-widest px-4 pb-2 pt-6 opacity-40">{month}</h3>
                    {groupedRides[month].map(ride => (
                      <div 
                        key={ride.id} 
                        onClick={() => setSelectedRide(ride)}
                        className="flex items-center gap-4 bg-white px-4 min-h-[80px] py-3 justify-between hover:bg-neutral-100 cursor-pointer border-b border-neutral-50 transition active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-[#141414] flex items-center justify-center rounded-xl bg-[#ededed] shrink-0 size-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#D9483E" viewBox="0 0 256 256">
                              <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
                            </svg>
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <p className="text-[#141414] text-base font-bold leading-tight truncate">{ride.destination_address}</p>
                            <p className="text-neutral-500 text-xs font-medium mt-1">
                             {new Date(ride.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · PGK {ride.fare}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusColor(ride.status)}`}>
                             {ride.status.replace('_', ' ')}
                           </span>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#ccc" viewBox="0 0 256 256">
                             <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                           </svg>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col px-4 pt-2 pb-10"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden mb-6">
                <div className="h-40 bg-neutral-100 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D9483E_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200 flex items-center gap-2">
                    <div className="size-2 bg-[#D9483E] rounded-full"></div>
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Trip Summary</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-xl font-bold text-[#141414]">PGK {selectedRide.fare}</h4>
                      <p className="text-neutral-500 text-sm">
                        {new Date(selectedRide.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${getStatusColor(selectedRide.status)}`}>
                       <p className="text-xs font-bold uppercase tracking-wider">{selectedRide.status.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col relative pl-6 gap-6 my-2">
                    <div className="absolute left-[3px] top-[10px] bottom-[10px] w-[2px] bg-neutral-100 flex flex-col items-center">
                       <div className="size-2.5 -mt-1.5 bg-neutral-800 rounded-full absolute top-0"></div>
                       <div className="size-2.5 -mb-1.5 bg-[#D9483E] rounded-full absolute bottom-0"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1.5">Pickup</p>
                      <p className="text-[#141414] font-medium text-sm leading-snug">{selectedRide.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1.5">Destination</p>
                      <p className="text-[#141414] font-medium text-sm leading-snug">{selectedRide.destination_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-[#141414] font-bold text-lg">{selectedRide.distance || '--'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-[#141414] font-bold text-lg">{selectedRide.duration || '--'}</p>
                  </div>
                </div>

                <button 
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
                  className={`mt-4 w-full h-14 bg-white border-2 border-neutral-100 text-[#141414] font-bold rounded-2xl hover:bg-neutral-50 transition active:scale-[0.98] flex items-center justify-center gap-2 ${sendingReceipt ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {sendingReceipt ? (
                    <><div className="w-4 h-4 border-2 border-[#D9483E] border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : 'View Receipt'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
