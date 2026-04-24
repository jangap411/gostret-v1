import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base overflow-hidden">
      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(70,241,197,0.05)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-7xl font-black tracking-tighter">
            <span className="text-primary">Go</span><span className="text-on-surface">Stret</span>
          </h1>
        </div>
        <p className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.8em] opacity-40 ml-2">GoStret, GoSeif</p>
      </motion.div>
      
      <div className="absolute bottom-24 flex flex-col items-center gap-4">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="size-16 rounded-full border border-primary/30 flex items-center justify-center"
        >
          <div className="size-2 bg-primary rounded-full shadow-glow" />
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
