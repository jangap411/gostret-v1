import { useSelector, useDispatch } from 'react-redux';
import { toggleOnline } from '../../store/driverSlice';
import { useNavigate } from 'react-router-dom';
import React,{ useState } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

const DriverAccounts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const isOnline = useSelector((state) => state.driver.isOnline);
  const onToggleOnline = () => dispatch(toggleOnline());

  const driverName = user.name || "Jed Moses";
  const profileImage = user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Uzozyg_eCMorbhLRnbEAos0EgecGGKS_PgyYG23F551US2rKvdbT9hjlQeGeaVnRXWnyyvDxIpSIYmrWRwS5loPwd2wTNY9bcyjGw0Wv0wj5twb8ILZbYZBdeCB_keKcACN-qQQXPwci2hjvd395gywucEpVs_t0s1IfYRYEIspm8xdVGAQt1Gs-8hxcLtn0pPIiHvlQbnIx0r3GMZBRj72eCqaplWvrtoBE2F2Oah9aX6yEsBQIKrxDGiqEB38qFrwQYj-vJv7R";

  const onSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="bg-[#FCFBF8] text-[#1D3557] font-body h-full flex flex-col relative"
    >
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
        {/* Bold Hero Profile Card */}
        <section className="bg-gradient-to-br from-[#1D3557] to-[#152a48] rounded-[32px] p-8 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <div className="size-20 rounded-full border-4 border-[#10B981]/30 p-1 bg-white/10 shadow-inner">
                   <img src={profileImage} alt={driverName} className="w-full h-full rounded-full object-cover" />
                </div>
                <button className="absolute -bottom-1 -right-1 size-7 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1D3557] active:scale-90 transition-transform">
                  <span className="material-symbols-outlined text-[16px] font-black">edit</span>
                </button>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter leading-tight">{driverName}</h2>
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

        {/* Management List Section */}
        <section className="space-y-4">
          <h4 className="px-4 text-neutral-400 text-[10px] font-black tracking-widest uppercase">Management</h4>
          <div className="bg-white rounded-[32px] overflow-hidden border border-neutral-100 shadow-sm">
            {[
              { icon: 'description', title: 'Vehicle Documents', color: 'text-blue-500' },
              { icon: 'safety_check', title: 'Safety Center', color: 'text-orange-500' },
              { icon: 'help_center', title: 'Help & Support', color: 'text-green-500' },
              { icon: 'settings', title: 'Settings', color: 'text-neutral-500' },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.title}>
                <button className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-all active:bg-neutral-100 group">
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl bg-neutral-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined font-black">{item.icon}</span>
                    </div>
                    <span className="font-bold text-[#1D3557]">{item.title}</span>
                  </div>
                  <span className="material-symbols-outlined text-neutral-300 group-hover:text-[#1D3557] transition-colors">chevron_right</span>
                </button>
                {idx < arr.length - 1 && <div className="mx-6 border-t border-neutral-50"></div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Log Out Section */}
        <section className="px-1 pb-8">
           <button 
              onClick={onSignOut}
              className="w-full py-5 rounded-[24px] bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm border border-red-100">
              <span className="material-symbols-outlined font-black">logout</span>
              Sign Out of Navigator
            </button>
            <p className="text-center text-neutral-400 text-[10px] font-bold mt-6 tracking-tight">App Version 2.8.4 (Driver Edition)</p>
        </section>
      </main>
    </motion.div>
  );
};

export default DriverAccounts;
