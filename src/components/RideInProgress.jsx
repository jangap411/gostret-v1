import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MapView from './MapView';
import { clearRide } from '../store/rideSlice';
import { socketService } from '../services/socket';

export default function RideInProgress() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeRide } = useSelector((state) => state.ride);
  const [driverLocation, setDriverLocation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!activeRide) {
      navigate('/');
      return;
    }

    socketService.joinRide(activeRide.id);

    // Listen for status changes (completion)
    socketService.onStatusUpdate((data) => {
      console.log('Ride progress status update:', data);
      if (data.status === 'completed') {
        setShowSuccess(true);
        setTimeout(() => {
          dispatch(clearRide());
          navigate('/activity');
        }, 3000);
      }
    });

    // Listen for driver movement
    socketService.onLocationUpdate((data) => {
      setDriverLocation(data);
    });

    return () => {
      socketService.off('status_update');
      socketService.off('location_update');
    };
  }, [activeRide, navigate, dispatch]);

  return (
    <div className="relative flex size-full h-full flex-col bg-white overflow-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="absolute inset-0 z-0">
        <MapView 
            center={driverLocation ? [driverLocation.lat, driverLocation.lng] : (activeRide ? [activeRide.pickup_lat, activeRide.pickup_lng] : null)}
            driverLocation={driverLocation}
            destination={activeRide ? [activeRide.destination_lat, activeRide.destination_lng] : null}
            zoom={15} 
            className="w-full h-full" 
        />
      </div>

      {/* Header Info */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="bg-[#141414] text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="size-10 bg-white/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a96,96,0,1,1-96-96A96.11,96.11,0,0,1,224,128Z" opacity="0.2"></path>
                  <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,0,128,216ZM128,80a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8h32a8,8,0,0,0,0-16H136V88A8,8,0,0,0,128,80Z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">En route to destination</h3>
                <p className="text-lg font-bold">Arriving in approx. 12 mins</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Fare</p>
              <p className="text-lg font-extrabold text-[#D9483E]">PGK {activeRide?.fare || '0.00'}</p>
           </div>
        </div>
      </div>

      {/* Bottom Sheet UI */}
      <div className="mt-auto relative z-10 p-4">
        <div className="bg-white p-6 rounded-[32px] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex -space-x-3">
                <div className="size-12 rounded-2xl border-4 border-white bg-neutral-100 overflow-hidden shadow-sm">
                   <img src={activeRide?.driver_avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"} alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div className="size-12 rounded-2xl border-4 border-white bg-neutral-100 flex items-center justify-center shadow-sm text-sm font-bold">
                   +2
                </div>
             </div>
             <div className="flex-1 ml-4">
                <h4 className="text-lg font-extrabold text-[#141414]">{activeRide?.driver_name || 'James K.'}</h4>
                <p className="text-sm font-medium text-neutral-400 truncate max-w-[150px]">{activeRide?.destination_address}</p>
             </div>
             <button className="h-12 px-6 bg-red-50 text-red-600 font-bold rounded-2xl active:scale-95 transition">
                Emergency
             </button>
          </div>

          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
             <motion.div 
                initial={{ width: "30%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
             />
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.1)] border border-neutral-100 flex flex-col items-center text-center gap-4 scale-in-center">
              <div className="size-20 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#10B981]/30">
                <span className="material-symbols-outlined text-4xl font-black">check</span>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter">Arrived at Destination</h3>
                <p className="text-neutral-500 font-bold text-sm mt-1">We hope you had a pleasant journey! Your receipt is now available.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
