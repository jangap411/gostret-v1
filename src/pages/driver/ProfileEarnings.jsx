import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileEarnings = ({
  onCashOut,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  
  const driverName = user.name || "Marcus Chen";
  const profileImage = user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAcyFZMHjBHrf_ZO-rM6lzJYypBZKh_7XL3WBKDgYHNcQOCP8lVyfHWiHMSVNNgAthu7on4Zs5CaXlnHNrBLeMXADcKXK6h7ahhk6gszVjfIQJ6RA2Ufj65a4efj2477ckDXfMVjnOtwSZnWIa17zHCznLsUD5fbx5E2AaTwUGc4DCHeNc4VHouRxa_6XP8lMXG4Tv_9PrebfmcS7Lx38rRw-FxIV8guTWXAzxJM3l6tXw0CSm9NwfmfjDSqq1XvM85oq-_RS4XPwGS";
  const sinceYear = "2021"; // Mocked for now
  const rating = "4.98"; // Mocked for now
  const totalTrips = "2,842"; // Mocked for now
  const yearsActive = "3.5"; // Mocked for now
  const weeklyEarnings = user.wallet_balance || "0.00";
  const dateRange = "Oct 23 - Oct 29"; // Mocked
  
  const earningsData = [
    { day: 'MON', height: '60%', isToday: false },
    { day: 'TUE', height: '45%', isToday: false },
    { day: 'WED', height: '85%', isToday: false },
    { day: 'THU', height: '70%', isToday: false },
    { day: 'FRI', height: '100%', isToday: true, colorClass: 'bg-[#D9483E]' },
    { day: 'SAT', height: '40%', isToday: false },
    { day: 'SUN', height: '25%', isToday: false },
  ];
  
  const quickActions = [
    { icon: 'description', title: 'Vehicle Documents', subtitle: 'Insurance, Registration, Permits' },
    { icon: 'support_agent', title: 'Help & Support', subtitle: '24/7 Priority driver assistance' },
    { icon: 'security', title: 'Safety Center', subtitle: 'Emergency tools & training' },
  ];

  const [isOnline, setIsOnline] = useState(true);
  const onToggleOnline = () => setIsOnline(!isOnline);

  const onSignOut = () => {
    localStorage.removeItem('isAuthenticated'); 
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="bg-[#FCFBF8] text-[#1D3557] font-body min-h-screen flex flex-col">
      {/* Consistent Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex justify-between items-center px-6 py-4 w-full h-full relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <img
                className="w-full h-full object-cover"
                src={profileImage}
                alt={driverName}
              />
            </div>
            <span className="font-black text-[#1D3557] tracking-tighter">Navigator</span>
          </div>
          
          <button 
            onClick={onToggleOnline}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm transition-all active:scale-95 ${isOnline ? 'bg-[#10B981] text-white' : 'bg-neutral-500 text-white'}`}
          >
            {isOnline && <span className="size-2 bg-white rounded-full animate-pulse"></span>}
            <span className="text-[10px] font-black tracking-widest uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-32 px-6 max-w-lg mx-auto w-full space-y-8 overflow-y-auto no-scrollbar">
        {/* Bold Hero Profile Card */}
        <section className="bg-gradient-to-br from-[#1D3557] to-[#152a48] rounded-[32px] p-8 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-4">
              <div className="size-20 rounded-full border-4 border-[#10B981]/30 p-1 bg-white/10 shadow-inner">
                 <img src={profileImage} alt={driverName} className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter leading-tight">Jed Moses</h2>
                <p className="text-[#637888] font-bold text-xs mt-1">Professional Partner since 2021</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-yellow-400 text-xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-white text-2xl font-black tracking-tighter">4.98</span>
              </div>
              <span className="bg-[#10B981] text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-lg shadow-sm">
                TOP RATED
              </span>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
            <p className="text-neutral-400 text-[10px] font-black tracking-widest uppercase mb-1">TOTAL TRIPS</p>
            <p className="text-2xl font-black text-[#1D3557] tracking-tighter">2,842</p>
          </div>
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
            <p className="text-neutral-400 text-[10px] font-black tracking-widest uppercase mb-1">YEARS ACTIVE</p>
            <p className="text-2xl font-black text-[#1D3557] tracking-tighter">3.5</p>
          </div>
        </section>

        {/* Weekly Earnings Section */}
        <section className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-neutral-400 text-xs font-black tracking-widest uppercase mb-1">Weekly Earnings</h3>
              <p className="text-[#1D3557] font-bold text-sm">Oct 23 - Oct 29</p>
            </div>
            <h4 className="text-3xl font-black text-[#1D3557] tracking-tighter">PGK 210.00</h4>
          </div>

          {/* Stylized Bar Chart */}
          <div className="flex items-end justify-between h-32 gap-3 px-1">
             {earningsData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full bg-neutral-50 rounded-full h-full relative overflow-hidden">
                    <div 
                      className={`absolute bottom-0 w-full rounded-full transition-all duration-700 ${day.isToday ? 'bg-[#10B981] shadow-[0_-4px_12px_rgba(16,185,129,0.3)]' : 'bg-[#1D3557]/10 group-hover:bg-[#1D3557]/20'}`}
                      style={{ height: day.height }}
                    ></div>
                  </div>
                  <span className={`text-[10px] font-black tracking-tight ${day.isToday ? 'text-[#10B981]' : 'text-neutral-400'}`}>
                    {day.day}
                  </span>
                </div>
             ))}
          </div>

          <button 
            onClick={onCashOut}
            className="w-full py-5 bg-[#1D3557] text-[#FCFBF8] rounded-2xl font-black text-lg shadow-xl shadow-[#1D3557]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined font-black">account_balance_wallet</span>
            Transfer to Bank
          </button>
        </section>

        {/* Log Out */}
        <button 
          onClick={onSignOut}
          className="w-full py-4 text-neutral-400 font-black tracking-widest text-[11px] uppercase hover:text-red-500 transition-colors active:scale-95">
          Sign Out of Account
        </button>
      </main>
    </div>
  );
};

export default ProfileEarnings;
