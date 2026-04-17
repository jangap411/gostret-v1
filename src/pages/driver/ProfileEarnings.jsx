import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleOnline } from '../../store/driverSlice';
import { useNavigate } from 'react-router-dom';

const ProfileEarnings = ({
  onCashOut,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const isOnline = useSelector((state) => state.driver.isOnline);
  const onToggleOnline = () => dispatch(toggleOnline());
  
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

  const onSignOut = () => {
    localStorage.removeItem('isAuthenticated'); 
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTransfer = () => {
    setIsTransferring(true);
    // Simulate API call
    setTimeout(() => {
      setIsTransferring(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-[#FCFBF8] text-[#1D3557] font-body h-full flex flex-col relative">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.1)] border border-neutral-100 flex flex-col items-center text-center gap-4 scale-in-center animate-out fade-out duration-1000">
              <div className="size-20 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#10B981]/30">
                <span className="material-symbols-outlined text-4xl font-black">check</span>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter">Transfer Successful</h3>
                <p className="text-neutral-500 font-bold text-sm mt-1">PGK 210.00 is on its way to your bank account.</p>
              </div>
           </div>
        </div>
      )}

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

      <main className="flex-1 pt-24 pb-32 px-6 max-w-lg mx-auto w-full space-y-8 overflow-y-auto">
        {/* Page Title */}
        <div className="flex flex-col gap-1 px-1">
          <h2 className="text-3xl font-black text-[#1D3557] tracking-tighter">Earnings Summary</h2>
          <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">Financial Performance</p>
        </div>

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
            <p className="text-neutral-400 text-[10px] font-black tracking-widest uppercase mb-1 font-mono">TOTAL TRIPS</p>
            <p className="text-2xl font-black text-[#1D3557] tracking-tighter">2,842</p>
          </div>
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
            <p className="text-neutral-400 text-[10px] font-black tracking-widest uppercase mb-1 font-mono">YEARS ACTIVE</p>
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
            onClick={handleTransfer}
            disabled={isTransferring}
            className={`w-full py-5 text-[#FCFBF8] rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isTransferring ? 'bg-neutral-400' : 'bg-[#1D3557] shadow-[#1D3557]/20'}`}>
            {isTransferring ? (
              <span className="animate-spin material-symbols-outlined font-black">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined font-black">account_balance_wallet</span>
            )}
            {isTransferring ? 'Processing...' : 'Transfer to Bank'}
          </button>
        </section>
      </main>
    </div>
  );
};

export default ProfileEarnings;
