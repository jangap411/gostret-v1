import React from 'react';
import { motion } from 'framer-motion';
import MapView from './MapView';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

export default function DriverEnRoute() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-neutral-50 group/design-root overflow-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      {/* Header and Map Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex items-center bg-neutral-50/80 backdrop-blur-sm p-4 pb-2 justify-between absolute top-0 left-0 right-0 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full cursor-pointer bg-white/50 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <div className="flex-1 text-center pr-12">
             <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Driver is on their way</h2>
             <p className="text-neutral-500 text-xs font-bold uppercase mt-0.5 tracking-wider">Arriving in 5 mins</p>
          </div>
        </div>
        
        <div className="flex-1 w-full h-full relative z-10">
          <MapView className="absolute inset-0 w-full h-full z-0" zoom={14} />
        </div>
      </div>

      {/* Driver Info Panel */}
      <div className="flex w-full flex-col bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] rounded-t-[32px] pt-3 pb-4 z-20 relative border-t border-neutral-100">
        <div className="flex flex-col items-stretch">
          <button className="flex h-5 w-full items-center justify-center cursor-pointer hover:bg-neutral-50 transition mb-1">
            <div className="h-1.5 w-12 rounded-full bg-[#dbdbdb]"></div>
          </button>
          
          <div className="px-5">
            <div className="flex items-center gap-4 py-3 border-b border-neutral-50">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shadow-md border-2 border-white ring-1 ring-neutral-100"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmrmKFQefW7EJhM2D4iJ63mUAC6XKuN10x07gdxp0KUNUpGUYTNI6nAfwEcDS9Lh6qaMZ5MgbRdaIl_mf2kOU1xPCn_e-D1pD7lxn3XCufxiIlsNQsiRxTJF4-3AGqX_N2ekMEXdMmG4JaVIr7nc4GUA7vvDuFL9GTHaN1rc4GLmD67jHk-a-j6rQw_kxDsdsmPLPs9IxjRAnlVmtiImUYxK0ttWTq4_YsFtaTqKjhmJTp_34ki_i5hz8bmZBaLRKSTP1DJRgJaBE")'}}
              ></div>
              <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[#141414] text-lg font-bold leading-none">Lucas</p>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold border border-yellow-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.07-31-51.07,31a16,16,0,0,1-23.84-17.34L60.6,153.74,15.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.33a16,16,0,0,1,29.44,0l23.21,55.33,59.46,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                    4.9
                  </div>
                </div>
                <p className="text-neutral-500 text-sm font-medium mt-1">Toyota Prius · ABC 1234</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 px-5 pt-4">
          <button
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#D9483E] text-white text-base font-bold shadow-lg shadow-red-100 hover:bg-[#C53D34] transition active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,48H40A16,16,0,0,0,24,64V176a16,16,0,0,0,16,16h40v32a8,8,0,0,0,13.17,6.15l42.47-35,53.49-1.15a16,16,0,0,0,14.87-16V64A16,16,0,0,0,216,48ZM176,136H80a8,8,0,0,1,0-16h96a8,8,0,0,1,0,16Zm0-32H80a8,8,0,0,1,0-16h96a8,8,0,0,1,0,16Z"></path>
            </svg>
            Message
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-neutral-100 text-[#1D3557] text-base font-bold border border-neutral-200 hover:bg-neutral-200 transition active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,1,1,0,0,1-.11.08L134.39,153c-18.42-10-33.8-25.39-43.77-43.81l14.28-25.43a1,1,0,0,1,.08-.11,16,16,0,0,0,1.4-15.21l-.06-.13L85.24,21.19a16,16,0,0,0-17.76-9.15,62.06,62.06,0,0,0-48.42,48C17.33,122.35,74.5,179.35,137.33,179.35a62,62,0,0,0,48-19.06,16,16,0,0,0-2.96-21.83Z"></path>
            </svg>
            Call
          </button>
        </div>
      </div>
    </motion.div>
  );
}
