import React from 'react';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
};

import { userService } from '../services/api';

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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
          <p className="font-medium">Dark Mode</p>
          <div className="w-12 h-6 bg-neutral-200 rounded-full relative p-0.5 cursor-pointer">
             <div className="size-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
          <p className="font-medium">Language</p>
          <p className="text-[#D9483E] font-bold">English</p>
        </div>
      </div>
    ),
    Notifications: (
      <div className="flex flex-col gap-4">
        {[
          { label: "Push Notifications", active: true },
          { label: "Email Notifications", active: true },
          { label: "SMS Notifications", active: false },
        ].map((item, id) => (
          <div key={id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
            <p className="font-medium">{item.label}</p>
            <div className={`w-12 h-6 ${item.active ? 'bg-green-500' : 'bg-neutral-200'} rounded-full relative p-0.5 cursor-pointer transition`}>
               <div className={`size-5 bg-white rounded-full shadow-sm transition-all ${item.active ? 'ml-6' : 'ml-0'}`}></div>
            </div>
          </div>
        ))}
      </div>
    ),
    Security: (
      <div className="flex flex-col gap-4">
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Change Password</button>
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Two-Factor Authentication</button>
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50 text-red-600">Delete Account</button>
      </div>
    ),
    Privacy: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
          <p className="font-medium">Location History</p>
          <div className="w-12 h-6 bg-green-500 rounded-full relative p-0.5">
             <div className="size-5 bg-white rounded-full shadow-sm ml-6"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100">
          <p className="font-medium">Data Sharing</p>
          <div className="w-12 h-6 bg-neutral-200 rounded-full relative p-0.5">
             <div className="size-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    ),
    Help: (
      <div className="flex flex-col gap-4">
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Help Center</button>
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Contact Support</button>
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Community Guidelines</button>
      </div>
    ),
    Legal: (
      <div className="flex flex-col gap-4">
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Terms of Service</button>
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Privacy Policy</button>
        <button className="w-full p-4 bg-white rounded-xl border border-neutral-100 text-left font-medium hover:bg-neutral-50">Licenses</button>
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
      className="relative flex size-full h-full flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between sticky top-0 z-50">
          <button 
            onClick={() => activeSubmenu ? setActiveSubmenu(null) : navigate(-1)} 
            className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {activeSubmenu ? activeSubmenu : 'Account'}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!activeSubmenu ? (
            <motion.div 
              key="main-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-1 mt-2"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 px-4 py-8 bg-white border-b border-neutral-100">
                <div className="relative cursor-pointer hover:opacity-80 transition" onClick={handleEditClick}>
                  <div 
                    className="size-20 rounded-full bg-neutral-100 border-2 border-white shadow-md bg-cover bg-center"
                    style={{ backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : 'none' }}
                  >
                    {!user?.avatar_url && (
                      <div className="flex items-center justify-center h-full text-2xl font-bold text-neutral-400">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 size-6 bg-[#D9483E] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="white" viewBox="0 0 256 256">
                      <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,104,152,64l24-24,40,40Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  {loading ? (
                    <div className="h-6 w-32 bg-neutral-100 animate-pulse rounded"></div>
                  ) : (
                    <h3 className="text-xl font-bold text-[#141414] leading-tight">{user?.name}</h3>
                  )}
                  <p className="text-neutral-500 text-sm font-medium">{user?.email}</p>
                  <div className="flex items-center justify-between w-full mt-1.5">
                    <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                      <div className="size-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                        Wallet: {loading ? '...' : `PGK ${user?.wallet_balance || '0.00'}`}
                      </span>
                    </div>
                    <button 
                      onClick={handleEditClick}
                      className="text-sm font-bold text-[#D9483E] hover:text-[#b53a31]"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {[
                { icon: "Gear", label: "Preferences", path: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" },
                { icon: "Bell", label: "Notifications", path: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" },
                { icon: "CreditCard", label: "Payment", path: "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z" },
                { icon: "Shield", label: "Security", path: "M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56l160,0Z" },
                { icon: "Lock", label: "Privacy", path: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z" },
                { icon: "Question", label: "Help", path: "M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" },
                { icon: "FileText", label: "Legal", path: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (item.label === 'Payment') navigate('/payment-methods');
                    else setActiveSubmenu(item.label);
                  }}
                  className="group flex items-center gap-4 hover:bg-neutral-100 cursor-pointer transition px-4 min-h-14 active:scale-[0.98]"
                >
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-10 group-hover:bg-[#e2e2e2]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d={item.path}></path>
                    </svg>
                  </div>
                  <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">{item.label}</p>
                  <div className="text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="submenu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 px-4 pt-4"
            >
              {submenus[activeSubmenu]}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <div>
        <div className="flex px-4 py-3 pb-8">
          <button
            onClick={() => { 
                localStorage.removeItem('isAuthenticated'); 
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login'); 
            }}
            className="flex min-w-[84px] max-w-[480px] w-full mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 flex-1 bg-neutral-100 text-[#1D3557] text-base font-bold leading-normal tracking-[0.015em] hover:bg-red-50 hover:text-red-600 transition"
          >
            <span className="truncate">Sign out</span>
          </button>
        </div>
      </div>

    </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <h3 className="text-xl font-bold text-[#141414]">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="size-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </button>
              </div>

              <div className="p-5 overflow-y-auto no-scrollbar">
                <form id="edit-profile-form" onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#141414]">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-[#D9483E] focus:ring-2 focus:ring-[#D9483E]/20 transition outline-none"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#141414]">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-[#D9483E] focus:ring-2 focus:ring-[#D9483E]/20 transition outline-none"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-sm font-bold text-[#141414] flex justify-between">
                      Avatar URL <span className="text-xs font-normal text-neutral-400">Optional</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="size-12 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden bg-cover bg-center flex items-center justify-center text-neutral-400 font-bold"
                           style={{ backgroundImage: editForm.avatar_url ? `url(${editForm.avatar_url})` : 'none' }}>
                         {!editForm.avatar_url && (editForm.name.charAt(0) || 'U')}
                      </div>
                      <input
                        type="url"
                        className="flex-1 h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-[#D9483E] focus:ring-2 focus:ring-[#D9483E]/20 transition outline-none"
                        value={editForm.avatar_url}
                        onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-neutral-100 bg-neutral-50">
                <button
                  type="submit"
                  form="edit-profile-form"
                  disabled={updating}
                  className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#D9483E] text-white font-bold tracking-wide active:scale-95 transition ${updating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#C53D34] shadow-md shadow-[#D9483E]/30'}`}
                >
                  {updating ? (
                    <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                  ) : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
