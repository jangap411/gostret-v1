import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-5xl font-extrabold tracking-tight">
            <span className="text-[#1D3557]">Go</span><span className="text-[#D9483E]">Stret</span>
          </h1>
          <span className="text-4xl">🥎</span>
        </div>
        <p className="text-neutral-500 font-medium tracking-wide">GoStret, Go Seif</p>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 w-12 h-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg className="animate-spin h-8 w-8 text-[#D9483E] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8,0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962,0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
