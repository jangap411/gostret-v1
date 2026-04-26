import React from 'react';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export default function Account() {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ name: '', email: '', avatar_url: '' });
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const profile = await userService.getProfile(token);
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditForm({ name: user?.name || '', email: user?.email || '', avatar_url: user?.avatar_url || '' });
    setIsEditing(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const updatedUser = await userService.updateProfile(editForm, token);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const submenus = {
    Preferences: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-border-subtle shadow-sm">
          <p className="font-bold text-on-surface">Dark Mode</p>
          <div className="w-12 h-6 bg-slate-100 rounded-full relative p-1 cursor-pointer">
             <div className="size-4 bg-white rounded-full shadow-md"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-border-subtle shadow-sm">
          <p className="font-bold text-on-surface">Language</p>
          <p className="text-accent font-black text-sm uppercase tracking-widest">English</p>
        </div>
      </div>
    ),
    Notifications: (
      <div className="flex flex-col gap-3">
        {[
          { label: "Push Notifications", active: true },
          { label: "Email Notifications", active: true },
          { label: "SMS Notifications", active: false },
        ].map((item, id) => (
          <div key={id} className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-border-subtle shadow-sm">
            <p className="font-bold text-on-surface">{item.label}</p>
            <div className={`w-12 h-6 ${item.active ? 'bg-success' : 'bg-slate-100'} rounded-full relative p-1 cursor-pointer transition-colors`}>
               <motion.div 
                animate={{ x: item.active ? 24 : 0 }}
                className="size-4 bg-white rounded-full shadow-md"
               />
            </div>
          </div>
        ))}
      </div>
    ),
    Security: (
      <div className="flex flex-col gap-3">
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Change Password</button>
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Two-Factor Authentication</button>
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-error hover:bg-red-50 transition-colors shadow-sm">Delete Account</button>
      </div>
    ),
    Help: (
      <div className="flex flex-col gap-3">
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Help Center</button>
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Contact Support</button>
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Community Guidelines</button>
      </div>
    ),
    Legal: (
      <div className="flex flex-col gap-3">
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Terms of Service</button>
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Privacy Policy</button>
        <button className="w-full p-5 bg-surface rounded-2xl border border-border-subtle text-left font-bold text-on-surface hover:bg-slate-800 transition-colors shadow-sm">Licenses</button>
      </div>
    )
  };

  return (
    <>
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-background justify-between group/design-root overflow-x-hidden font-body"
    >
      <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24">
        {/* Sticky Header with Glassmorphism */}
        <div className="glass-surface flex items-center p-4 justify-between sticky top-0 z-50 border-b border-white/20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => activeSubmenu ? setActiveSubmenu(null) : navigate('/')} 
            className="text-slate-400 flex size-11 shrink-0 items-center justify-center hover:bg-white/10 transition rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined font-black">
              {activeSubmenu ? 'arrow_back' : 'home'}
            </span>
          </motion.button>
          <h2 className="text-on-surface text-xl font-black leading-tight tracking-tighter flex-1 text-center pr-11 uppercase">
            {activeSubmenu ? activeSubmenu : 'Account'}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!activeSubmenu ? (
            <motion.div 
              key="main-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col mt-2 px-4 gap-6"
            >
              {/* Profile Card with Glassmorphism effect */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-6 p-8 bg-surface rounded-[32px] shadow-premium border border-border-subtle relative overflow-hidden group/profile mt-4"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover/profile:bg-accent/10 transition-colors" />
                
                <div className="relative cursor-pointer group/avatar" onClick={handleEditClick}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="size-24 rounded-[28px] bg-slate-800 border-4 border-surface shadow-premium bg-cover bg-center flex items-center justify-center overflow-hidden"
                    style={{ backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : 'none' }}
                  >
                    {!user?.avatar_url && (
                      <span className="text-3xl font-black text-slate-600">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </motion.div>
                  <div className="absolute -bottom-1 -right-1 size-8 bg-slate-100 rounded-2xl border-4 border-surface flex items-center justify-center shadow-premium group-hover/avatar:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-800 text-base font-black">edit</span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  {loading ? (
                    <div className="h-8 w-32 bg-slate-800 animate-pulse rounded-xl mb-2"></div>
                  ) : (
                    <h3 className="text-2xl font-black text-on-surface leading-none tracking-tighter truncate">{user?.name}</h3>
                  )}
                  <p className="text-slate-500 text-sm font-bold tracking-tight mt-2 truncate opacity-80">{user?.email}</p>
                  
                  <div className="flex items-center justify-between w-full mt-5">
                    <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-xl border border-success/20">
                      <div className="size-1.5 bg-success rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black text-success uppercase tracking-[0.1em]">
                        {loading ? '...' : `PGK ${user?.wallet_balance || '0.00'}`}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col gap-2">
                {[
                  { icon: "settings", label: "Preferences" },
                  { icon: "notifications", label: "Notifications" },
                  { icon: "credit_card", label: "Payment" },
                  { icon: "shield", label: "Security" },
                  { icon: "lock", label: "Privacy" },
                  { icon: "help", label: "Help" },
                  { icon: "article", label: "Legal" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={listItemVariants}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (item.label === 'Payment') navigate('/payment-methods');
                      else setActiveSubmenu(item.label);
                    }}
                    className="group flex items-center gap-4 bg-surface/50 hover:bg-surface cursor-pointer transition-all px-5 min-h-[72px] rounded-2xl border border-transparent hover:border-border-subtle hover:shadow-sm"
                  >
                    <div className="flex items-center justify-center rounded-2xl bg-slate-800 shrink-0 size-12 group-hover:bg-slate-50 transition-all border border-transparent group-hover:border-white/20">
                      <span className="material-symbols-outlined font-black text-2xl text-slate-500 group-hover:text-slate-800 transition-colors">{item.icon}</span>
                    </div>
                    <p className="text-on-surface group-hover:text-white text-[15px] font-bold leading-normal flex-1 tracking-tight transition-colors">{item.label}</p>
                    <div className="text-slate-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="submenu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 px-4 pt-6"
            >
              <div className="mb-8 px-2">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] opacity-60">General Settings</h3>
              </div>
              {submenus[activeSubmenu]}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Sign Out Button */}
      {!activeSubmenu && (
        <div className="px-6 py-6 pb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { 
                localStorage.removeItem('isAuthenticated'); 
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login'); 
            }}
            className="w-full h-16 glass-surface text-slate-400 font-black rounded-2xl flex items-center justify-center gap-3 border border-white/20 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-[15px] tracking-tight">Sign Out</span>
          </motion.button>
        </div>
      )}

    </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-surface rounded-[40px] shadow-premium w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
            >
              <div className="flex items-center justify-between p-8 border-b border-border-subtle">
                <h3 className="text-2xl font-black text-on-surface tracking-tighter">Edit Profile</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setIsEditing(false)}
                  className="size-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined font-black text-xl">close</span>
                </motion.button>
              </div>

              <div className="p-8 overflow-y-auto no-scrollbar">
                <form id="edit-profile-form" onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full h-16 px-6 rounded-[20px] border border-border-subtle bg-slate-800 focus:bg-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100/5 transition-all outline-none font-bold text-on-surface placeholder:font-medium placeholder:text-slate-600"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full h-16 px-6 rounded-[20px] border border-border-subtle bg-slate-800 focus:bg-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100/5 transition-all outline-none font-bold text-on-surface placeholder:font-medium placeholder:text-slate-600"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Avatar URL</label>
                    <div className="flex gap-4">
                      <div className="size-16 shrink-0 rounded-[20px] bg-slate-800 border border-border-subtle overflow-hidden bg-cover bg-center flex items-center justify-center text-slate-600 font-black text-xl shadow-inner"
                           style={{ backgroundImage: editForm.avatar_url ? `url(${editForm.avatar_url})` : 'none' }}>
                         {!editForm.avatar_url && (editForm.name.charAt(0) || 'U')}
                      </div>
                      <input
                        type="url"
                        className="flex-1 h-16 px-6 rounded-[20px] border border-border-subtle bg-slate-800 focus:bg-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100/5 transition-all outline-none font-bold text-on-surface placeholder:font-medium placeholder:text-slate-600"
                        value={editForm.avatar_url}
                        onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-8 border-t border-border-subtle bg-slate-50/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  form="edit-profile-form"
                  disabled={updating}
                  className={`w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-slate-100 text-slate-900 font-black tracking-tight transition-all text-lg shadow-premium border-b-4 border-slate-400 ${updating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white'}`}
                >
                  {updating ? (
                    <><div className="size-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> Saving...</>
                  ) : 'Save Profile'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
