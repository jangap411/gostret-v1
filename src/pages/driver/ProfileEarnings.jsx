import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleOnline } from '../../store/driverSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const ProfileEarnings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const isOnline = useSelector((state) => state.driver.isOnline);
  const onToggleOnline = () => dispatch(toggleOnline());
  
  const profileImage = user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const profile = await userService.getProfile(token);
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
      }
    };
    fetchBalance();
  }, []);

  const earningsData = [
    { day: 'MON', height: '60%', isToday: false },
    { day: 'TUE', height: '45%', isToday: false },
    { day: 'WED', height: '85%', isToday: false },
    { day: 'THU', height: '70%', isToday: false },
    { day: 'FRI', height: '100%', isToday: true },
    { day: 'SAT', height: '40%', isToday: false },
    { day: 'SUN', height: '25%', isToday: false },
  ];
  
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTransfer = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-background text-primary font-body h-full flex flex-col relative overflow-hidden"
    >
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface rounded-[48px] p-10 shadow-premium border border-white/20 flex flex-col items-center text-center gap-6 max-w-sm"
            >
              <div className="size-24 bg-success rounded-[32px] flex items-center justify-center text-white shadow-premium relative">
                <span className="material-symbols-outlined text-5xl font-black">check</span>
                <span className="absolute inset-0 size-full bg-success/20 rounded-[32px] animate-ping"></span>
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter text-primary">Transfer Initiated</h3>
                <p className="text-slate-500 font-bold text-sm mt-3 leading-relaxed opacity-80">
                  PGK {parseFloat(user.wallet_balance || 0).toFixed(2)} is being securely transferred to your linked bank account.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM HEADER - GLASSMORPHISM */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-slate-100">
            <img className="w-full h-full object-cover" src={profileImage} alt="Profile" />
          </div>
          <span className="font-black text-primary tracking-tighter text-lg uppercase">Earnings</span>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleOnline}
          className={`flex items-center gap-2.5 px-5 py-2 rounded-full shadow-sm transition-all border ${
            isOnline 
              ? 'bg-success/10 border-success/20 text-success' 
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
        >
          {isOnline && <span className="size-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </motion.button>
      </header>

      <main className="flex-1 pt-28 pb-32 px-6 overflow-y-auto no-scrollbar max-w-lg mx-auto w-full">
        {/* WALLET BALANCE CARD */}
        <section className="bg-surface rounded-[40px] p-8 shadow-premium border border-white/20 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
          
          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Available Balance</h3>
            <div className="flex items-baseline gap-2 mt-1">
               <span className="text-2xl font-black text-primary opacity-40 tracking-tighter uppercase">PGK</span>
               <h4 className="text-5xl font-black text-primary tracking-tighter leading-none">
                 {parseFloat(user.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </h4>
            </div>
            
            <p className="text-slate-400 text-[11px] font-bold mt-4 uppercase tracking-widest opacity-80">Ready for instant cashout</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTransfer}
            disabled={isTransferring}
            className={`w-full mt-10 h-16 rounded-[24px] font-black text-lg shadow-premium flex items-center justify-center gap-3 transition-all border-b-4 ${
              isTransferring 
                ? 'bg-slate-100 text-slate-400 border-slate-200' 
                : 'bg-primary text-white border-slate-900'
            }`}
          >
            {isTransferring ? (
              <div className="size-6 border-4 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined font-black">account_balance_wallet</span>
                <span>Transfer to Bank</span>
              </>
            )}
          </motion.button>
        </section>

        {/* WEEKLY ACTIVITY SECTION */}
        <section className="bg-white/40 rounded-[40px] p-8 border border-white/40 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Weekly Activity</h3>
            <div className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">OCT 23 - 29</div>
          </div>

          {/* Stylized Bar Chart */}
          <div className="flex items-end justify-between h-40 gap-3 px-2">
             {earningsData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-4 group h-full">
                  <div className="w-full bg-slate-100/50 rounded-full flex-1 relative overflow-hidden border border-slate-50">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: day.height }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className={`absolute bottom-0 w-full rounded-full transition-all ${
                        day.isToday ? 'bg-success shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-primary/10 group-hover:bg-primary/20'
                      }`}
                    ></motion.div>
                   </div>
                  <span className={`text-[9px] font-black tracking-tight ${day.isToday ? 'text-success' : 'text-slate-300'}`}>
                    {day.day}
                  </span>
                </div>
             ))}
          </div>
        </section>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          <div className="bg-surface rounded-3xl p-6 border border-white/20 shadow-sm">
             <span className="material-symbols-outlined text-primary/30 text-2xl mb-4 font-black">local_taxi</span>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 opacity-60">Total Trips</p>
             <p className="text-2xl font-black text-primary tracking-tighter">2,842</p>
          </div>
          <div className="bg-surface rounded-3xl p-6 border border-white/20 shadow-sm">
             <span className="material-symbols-outlined text-primary/30 text-2xl mb-4 font-black">verified_user</span>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 opacity-60">Years Active</p>
             <p className="text-2xl font-black text-primary tracking-tighter">3.5</p>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          {[
            { icon: 'description', label: 'Vehicle Documents' },
            { icon: 'support_agent', label: 'Help & Support' },
            { icon: 'security', label: 'Safety Center' }
          ].map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-5 bg-surface rounded-[24px] border border-white/20 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined text-xl font-black">{item.icon}</span>
                </div>
                <span className="text-sm font-black text-primary tracking-tight uppercase opacity-80">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 font-black">chevron_right</span>
            </motion.button>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

export default ProfileEarnings;
