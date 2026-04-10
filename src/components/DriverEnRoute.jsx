import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MapView from './MapView';
import { setActiveRide } from '../store/rideSlice';
import { socketService } from '../services/socket';

export default function DriverEnRoute() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeRide } = useSelector((state) => state.ride);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    if (!activeRide) {
      navigate('/');
      return;
    }

    socketService.joinRide(activeRide.id);

    // Listen for status changes
    socketService.onStatusUpdate((data) => {
      if (data.status === 'in_progress') {
        const updatedRide = { ...activeRide, status: 'in_progress' };
        dispatch(setActiveRide(updatedRide));
        navigate('/ride-in-progress');
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
            center={activeRide?.pickup_lat ? [activeRide.pickup_lat, activeRide.pickup_lng] : null} 
            driverLocation={driverLocation}
            zoom={14} 
            className="w-full h-full" 
        />
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-neutral-100">
           <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M232,128a104,104,0,1,1-104-104A104.11,104.11,0,0,1,232,128Z" opacity="0.2"></path>
                  <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,0,128,216Zm45.66-93.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-16-16a8,8,0,0,1,11.32-11.32L136,148.69l26.34-26.35A8,8,0,0,1,173.66,122.34Z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-[#141414] text-lg font-bold">Driver is en route</h3>
                <p className="text-neutral-500 text-sm font-medium">Arriving in approx. 3 mins</p>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-auto relative z-10 p-4">
        <div className="bg-white p-6 rounded-[32px] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-14 bg-neutral-100 rounded-2xl overflow-hidden border-2 border-neutral-50 shadow-sm relative group">
                <img 
                  src={activeRide?.driver_avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"} 
                  alt="Driver" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h4 className="text-[#141414] text-lg font-extrabold tracking-tight">{activeRide?.driver_name || 'James K.'}</h4>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-bold text-[#141414]">4.9</span>
                  <span className="text-neutral-300 mx-1">|</span>
                  <span className="text-sm font-bold text-neutral-400">Toyota Corolla (PNG 123)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#141414] hover:bg-neutral-200 transition active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L143.16,155.3c-15.42-7.38-31.39-23.25-38.76-38.63l16.03-16.03a8.11,8.11,0,0,0,.56-.76,16,16,0,0,0,1.41-15.22l-.06-.13L101.24,47.41a16,16,0,0,0-14.47-9.41A16.14,16.14,0,0,0,70.51,49.25C64.67,61.12,47,101.48,82.46,155c32.74,49.43,71.19,69.56,99.54,69.56a47.58,47.58,0,0,0,15.63-2.52A16,16,0,0,0,207.29,207C207.29,207,222.37,158.46,222.37,158.46Z"></path>
                </svg>
              </button>
              <button className="size-12 rounded-2xl bg-[#D9483E] flex items-center justify-center text-white hover:bg-[#c43d35] transition shadow-lg shadow-red-100 active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,40H40A16,16,0,0,0,24,56V184a16,16,0,0,0,16,16H72.83l38,38a8,8,0,0,0,11.34,0l38-38H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,184H156.69l-28.69,28.69L99.31,184H40V56H216V184Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
