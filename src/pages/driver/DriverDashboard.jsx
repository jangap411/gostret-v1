import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../../components/MapView';

const DriverDashboard = ({
  earningsGrowth = "+12% vs LW",
  earningsData = [
    { day: 'MON', height: '40%', active: false },
    { day: 'TUE', height: '65%', active: false },
    { day: 'WED', height: '90%', active: true },
    { day: 'THU', height: '55%', active: false },
    { day: 'FRI', height: '75%', active: false },
    { day: 'SAT', height: '30%', active: false },
    { day: 'SUN', height: '20%', active: false },
  ],
  activeZone = "Downtown SF",
  rating = "4.98",
  totalTrips = "142",
  recentActivity = [
    {
      id: 1,
      icon: 'local_taxi',
      title: 'Airport Premium Express',
      subtitle: 'Completed • 14:20 PM',
      amount: '+$42.50',
      meta: 'Tip Included',
      metaColor: 'text-green-600',
    },
    {
      id: 2,
      icon: 'speed',
      title: 'Rush Hour Boost',
      subtitle: 'Promotion • 12:45 PM',
      amount: '+$8.00',
      meta: 'Multiplier x1.4',
      metaColor: 'text-neutral-500',
    },
    {
      id: 3,
      icon: 'person_pin_circle',
      title: 'City Center Drop-off',
      subtitle: 'Completed • 11:15 AM',
      amount: '+$18.25',
      meta: '8.2 miles',
      metaColor: 'text-neutral-500',
    },
  ],
  onViewAllActivity,
  onSOS,
}) => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isOnline, setIsOnline] = useState(true);
  const [mapCenter, setMapCenter] = useState([-9.43869006941101, 147.1810054779053]);
  const [mapZoom, setMapZoom] = useState(13);

  const profileImage = user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Uzozyg_eCMorbhLRnbEAos0EgecGGKS_PgyYG23F551US2rKvdbT9hjlQeGeaVnRXWnyyvDxIpSIYmrWRwS5loPwd2wTNY9bcyjGw0Wv0wj5twb8ILZbYZBdeCB_keKcACN-qQQXPwci2hjvd395gywucEpVs_t0s1IfYRYEIspm8xdVGAQt1Gs-8hxcLtn0pPIiHvlQbnIx0r3GMZBRj72eCqaplWvrtoBE2F2Oah9aX6yEsBQIKrxDGiqEB38qFrwQYj-vJv7R";
  const weeklyEarnings = user.wallet_balance || "1,284.50";

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setMapZoom(16);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  const onToggleOnline = () => setIsOnline(!isOnline);

  return (
    <div className="bg-neutral-50 text-[#141414] font-body h-full relative overflow-hidden flex flex-col">
      {/* Full-Screen Map Background */}
        <MapView center={mapCenter} zoom={mapZoom} className="absolute inset-0 w-full h-full z-0" />
        
        {/* Floating Minimal Header */}
        <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <button 
            onClick={() => navigate('/driver/incoming-request')}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/40 backdrop-blur-md text-[#1D3557] border border-white/20 shadow-sm active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined text-sm font-black group-hover:rotate-12 transition-transform">bolt</span>
            <span className="text-[10px] font-black tracking-widest uppercase">TEST REQUEST</span>
          </button>

          <button 
            onClick={onToggleOnline}
            className={`pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 ${isOnline ? 'bg-[#10B981] text-white' : 'bg-neutral-500 text-white'} border border-white/20`}
          >
            {isOnline && <span className="size-2 bg-white rounded-full animate-pulse"></span>}
            <span className="text-[11px] font-black tracking-widest uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Floating Earnings Card */}
        <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none">
          <div 
            onClick={() => navigate('/earnings')}
            className="bg-white/90 backdrop-blur-lg rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 pointer-events-auto max-w-sm mx-auto cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">Weekly Earnings</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-3xl font-black text-[#1D3557] tracking-tighter">PGK {weeklyEarnings}</h2>
                </div>
              </div>
              <div className="bg-[#1D3557] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm">
                +12% vs LW
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex justify-between items-center mt-6 px-1">
              {earningsData.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1.5">
                  <div className={`size-1.5 rounded-full ${day.active ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-neutral-200'}`}></div>
                  <span className={`text-[10px] font-bold tracking-tight ${day.active ? 'text-[#10B981]' : 'text-neutral-400'}`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SOS FAB */}
        <button 
          onClick={onSOS}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#D9483E] text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform border-4 border-white/20">
          <span className="material-symbols-outlined font-black text-xl">sos</span>
        </button>
        
        {/* Recenter button */}
        <button 
          onClick={handleLocateMe}
          className="absolute right-4 bottom-32 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1D3557] shadow-xl active:scale-90 transition-all border border-neutral-100">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>
  );
};

export default DriverDashboard;
