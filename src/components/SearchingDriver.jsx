import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { useSelector, useDispatch } from 'react-redux';
import { rideService } from '../services/api';
import { setActiveRide, clearRide } from '../store/rideSlice';
import { socketService } from '../services/socket';

export default function SearchingDriver() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const pickup = useSelector((state) => state.ride.pickup);
  const { activeRide } = useSelector((state) => state.ride);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    // Progress bar simulation
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 200);

    if (!activeRide) {
      navigate('/');
      return;
    }

    // Join room for this ride
    socketService.joinRide(activeRide.id);

    // Listen for status changes
    socketService.onStatusUpdate((data) => {
      console.log('Socket status update:', data);
      if (data.status === 'accepted') {
        const updatedRide = { ...activeRide, status: 'accepted' };
        dispatch(setActiveRide(updatedRide));
        clearInterval(progressTimer);
        navigate('/driver-en-route');
      } else if (data.status === 'cancelled') {
        dispatch(clearRide());
        navigate('/');
      }
    });

    return () => {
      clearInterval(progressTimer);
      socketService.off('status_update');
    };
  }, [activeRide, navigate, dispatch]);

  const handleCancel = async () => {
    if (!activeRide?.id) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await rideService.updateRideStatus(activeRide.id, 'cancelled', token);
      dispatch(clearRide());
      navigate('/');
    } catch (error) {
      console.error("Cancellation failed", error);
      alert("Failed to cancel ride: " + error.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="relative flex size-full h-full flex-col bg-white overflow-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      {/* Background Map with Blur */}
      <div className="absolute inset-0 z-0">
        <MapView center={pickup?.marker?.position} zoom={15} className="w-full h-full opacity-40 blur-[2px]" />
      </div>

      {/* Pulsating Search Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
        <div className="relative flex items-center justify-center">
            <motion.div 
                animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                className="absolute w-32 h-32 bg-[#D9483E]/20 rounded-full"
            />
            <motion.div 
                animate={{ scale: [1, 1.8, 2.5], opacity: [0.4, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 0.5 }}
                className="absolute w-32 h-32 bg-[#D9483E]/10 rounded-full"
            />
            
            <div className="relative w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-[#D9483E]/10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 border-t-4 border-r-4 border-transparent border-t-[#D9483E] border-r-[#D9483E] rounded-full"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#D9483E" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
            </div>
        </div>

        <div className="mt-12 text-center px-8">
            <h2 className="text-[#141414] text-2xl font-extrabold tracking-tight mb-2">Searching for a driver</h2>
            <p className="text-neutral-500 font-medium font-jakarta">Finding the best route and nearby rides for you...</p>
        </div>

        <div className="mt-10 w-full max-w-[280px]">
            <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#D9483E] shadow-[0_0_10px_rgba(217,72,62,0.4)]"
                />
            </div>
            <div className="mt-3 flex justify-between items-center text-xs font-bold text-neutral-400 tracking-wider uppercase">
                <span>{progress < 50 ? 'Scanning area' : progress < 90 ? 'Locating driver' : 'Connecting'}</span>
                <span>{progress}%</span>
            </div>
        </div>
        
        <div className="mt-10">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className={`px-8 py-3 rounded-full border-2 border-neutral-300 text-neutral-600 font-bold hover:bg-neutral-50 active:scale-95 transition-all ${cancelling ? 'opacity-50' : ''}`}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Ride'}
          </button>
        </div>
      </div>


      {/* Bottom Tip Panel */}
      <div className="mt-auto p-6 z-20">
        <div className="bg-[#141414] text-white p-5 rounded-3xl shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-xl">💡</span>
            </div>
            <div>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest text-[10px] mb-0.5">Quick Tip</p>
                <p className="text-sm font-medium leading-snug">Drivers prefer exact pin locations. You can always refine your pickup next time.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
