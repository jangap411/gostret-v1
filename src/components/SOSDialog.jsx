import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-base/80 backdrop-blur-2xl px-6"
        >
          {/* Overlay glow */}
          <div className="absolute inset-0 bg-error/10 animate-pulse pointer-events-none"></div>
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-surface rounded-[40px] p-8 w-full max-w-sm flex flex-col items-center shadow-premium border border-white/10 text-center gap-8 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 size-40 bg-error/5 rounded-full blur-3xl"></div>
            
            <div className="size-28 bg-error/20 rounded-full flex items-center justify-center text-error shadow-inner relative z-10">
              <span className="material-symbols-outlined text-6xl font-black">sos</span>
              <span className="absolute inset-0 size-full bg-error/30 rounded-full animate-ping opacity-50"></span>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black text-on-surface tracking-tighter uppercase">Help Required?</h2>
              <p className="text-on-surface-variant font-medium text-base mt-4 leading-relaxed opacity-80">
                Are you in immediate danger? Tapping confirm will notify our <span className="text-error font-black">24/7 Security Team</span> and open emergency services.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-4 relative z-10">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="w-full h-18 bg-error text-white font-black rounded-pill flex items-center justify-center gap-3 shadow-premium text-lg uppercase tracking-widest"
              >
                <span className="material-symbols-outlined font-black">security</span>
                Yes, Confirm SOS
              </motion.button>
              
              <button 
                onClick={onClose}
                className="w-full h-14 text-on-surface-variant font-black text-xs tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity"
              >
                No, I'm Safe
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOSDialog;
