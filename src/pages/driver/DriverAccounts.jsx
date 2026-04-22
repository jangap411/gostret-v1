import { useSelector, useDispatch } from 'react-redux';
import { toggleOnline } from '../../store/driverSlice';
import { useNavigate } from 'react-router-dom';
import React,{ useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const DriverAccounts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const isOnline = useSelector((state) => state.driver.isOnline);
  const onToggleOnline = () => dispatch(toggleOnline());

  const driverName = user.name || "Jed Moses";
  const profileImage = user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

  const onSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [carModel, setCarModel] = useState(user.car_model || '');
  const [carPlate, setCarPlate] = useState(user.car_plate || '');
  const [isSaving, setIsSaving] = useState(false);

  const saveVehicleInfo = async () => {
     setIsSaving(true);
     try {
        const token = localStorage.getItem('token');
        if(!token) return;
        const updatedUser = await userService.updateProfile({ car_model: carModel, car_plate: carPlate }, token);
        localStorage.setItem('user', JSON.stringify(updatedUser));
     } catch(e) {
        console.error(e);
     } finally {
        setIsSaving(false);
     }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-background text-primary font-body h-full flex flex-col relative overflow-hidden"
    >
      {/* PREMIUM HEADER - GLASSMORPHISM */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-100">
            <img className="w-full h-full object-cover" src={profileImage} alt="Profile" />
          </div>
          <span className="font-black text-primary tracking-tighter text-lg uppercase">Navigator</span>
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
        
        {/* PREMIUM DRIVER HERO CARD */}
        <section className="bg-primary rounded-[48px] p-8 shadow-premium relative overflow-hidden border border-slate-800 mb-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-6">
              <div className="relative group">
                <div className="size-24 rounded-[32px] border-4 border-white/10 p-1.5 bg-white/5 shadow-inner">
                   <img src={profileImage} alt={driverName} className="w-full h-full rounded-[24px] object-cover" />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-2 -right-2 size-9 bg-white rounded-2xl shadow-premium flex items-center justify-center text-primary border border-slate-100"
                >
                  <span className="material-symbols-outlined text-lg font-black">edit</span>
                </motion.button>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter leading-tight">{driverName}</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 opacity-80">Gold Partner since 2021</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 text-right">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm">
                <span className="material-symbols-outlined text-yellow-400 text-2xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-white text-3xl font-black tracking-tighter">4.98</span>
              </div>
              <div className="bg-success text-white text-[9px] font-black tracking-[0.3em] uppercase px-4 py-1.5 rounded-xl shadow-lg border border-white/10">
                TOP RATED
              </div>
            </div>
          </div>
        </section>

        {/* VEHICLE CONFIGURATION */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5 px-2">
            <h4 className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Vehicle Identity</h4>
            <div className="size-2 bg-primary/20 rounded-full"></div>
          </div>
          
          <div className="bg-surface p-7 rounded-[40px] shadow-premium border border-white/20 flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase ml-2 opacity-80">Car Model</label>
              <div className="relative group/input">
                <input 
                  type="text" 
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="e.g. Toyota Prius"
                  className="w-full bg-slate-50/50 border border-border-subtle text-primary font-bold rounded-2xl px-5 py-4 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase ml-2 opacity-80">License Plate</label>
              <div className="relative group/input">
                <input 
                  type="text" 
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  placeholder="e.g. ABC 123"
                  className="w-full bg-slate-50/50 border border-border-subtle text-primary font-bold rounded-2xl px-5 py-4 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveVehicleInfo}
              disabled={isSaving}
              className="mt-2 w-full h-16 bg-primary text-white font-black rounded-[24px] tracking-tight shadow-premium transition-all border-b-4 border-slate-900 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : 'Update Vehicle Data'}
            </motion.button>
          </div>
        </section>

        {/* MANAGEMENT ACTIONS */}
        <section className="mb-12">
          <h4 className="px-4 mb-5 text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Management</h4>
          <div className="bg-surface rounded-[40px] overflow-hidden border border-white/20 shadow-premium divide-y divide-slate-100">
            {[
              { icon: 'description', title: 'Vehicle Documents', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: 'safety_check', title: 'Safety Center', color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: 'help_center', title: 'Help & Support', color: 'text-success', bg: 'bg-success/10' },
              { icon: 'settings', title: 'App Settings', color: 'text-slate-400', bg: 'bg-slate-50' },
            ].map((item) => (
              <motion.button 
                key={item.title}
                whileTap={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                className="w-full flex items-center justify-between p-6 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={`size-12 rounded-[18px] ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <span className="material-symbols-outlined font-black text-2xl">{item.icon}</span>
                  </div>
                  <span className="font-black text-primary tracking-tight opacity-80 uppercase text-xs tracking-[0.1em]">{item.title}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ACCOUNT EXIT */}
        <section className="pb-10">
           <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSignOut}
              className="w-full py-5 rounded-[24px] bg-accent/5 text-accent font-black text-xs tracking-[0.25em] uppercase transition-all flex items-center justify-center gap-4 border border-accent/10 shadow-sm"
           >
              <span className="material-symbols-outlined font-black">logout</span>
              Sign Out of Navigator
            </motion.button>
            <div className="mt-8 text-center">
              <p className="text-slate-300 font-black text-[9px] tracking-[0.3em] uppercase opacity-60">Engineered for Excellence</p>
              <p className="text-slate-400 text-[10px] font-bold mt-2 opacity-40">Build 2.9.1 • Driver Edition</p>
            </div>
        </section>
      </main>
    </motion.div>
  );
};

export default DriverAccounts;
