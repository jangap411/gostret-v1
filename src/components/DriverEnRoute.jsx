import React from 'react';
import { motion } from 'framer-motion';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

export default function DriverEnRoute() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between">
          <button className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full" data-icon="ArrowLeft" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Driver is on their way</h2>
        </div>
        <div className="flex px-4 py-3 relative h-[400px]">
          <div className="w-full h-full rounded-xl overflow-hidden relative z-0">
            <MapView className="absolute inset-0 w-full h-full z-0" zoom={14} />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-end items-stretch bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl pt-2 pb-5 fixed bottom-0 z-10 w-full max-w-[480px] mx-auto left-0 right-0">
        <div className="flex flex-col items-stretch bg-white">
          <button className="flex h-5 w-full items-center justify-center cursor-pointer hover:bg-neutral-100 transition"><div className="h-1 w-9 rounded-full bg-[#dbdbdb]"></div></button>
          <div className="flex-1">
            <div className="flex items-center gap-4 bg-white px-5 min-h-[72px] py-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shadow-sm"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmrmKFQefW7EJhM2D4iJ63mUAC6XKuN10x07gdxp0KUNUpGUYTNI6nAfwEcDS9Lh6qaMZ5MgbRdaIl_mf2kOU1xPCn_e-D1pD7lxn3XCufxiIlsNQsiRxTJF4-3AGqX_N2ekMEXdMmG4JaVIr7nc4GUA7vvDuFL9GTHaN1rc4GLmD67jHk-a-j6rQw_kxDsdsmPLPs9IxjRAnlVmtiImUYxK0ttWTq4_YsFtaTqKjhmJTp_34ki_i5hz8bmZBaLRKSTP1DJRgJaBE")'}}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">Lucas</p>
                <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">5 min</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white px-5 min-h-[72px] py-2">
              <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12" data-icon="Car" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">Arriving in</p>
                <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">Toyota Prius</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-stretch">
          <div className="flex flex-1 gap-3 flex-wrap px-5 py-3 justify-between">
            <button
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 flex-1 bg-[#D9483E] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#C53D34] transition"
            >
              <span className="truncate">Message</span>
            </button>
            <button
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 flex-1 bg-neutral-100 text-[#1D3557] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#e0e0e0] transition"
            >
              <span className="truncate">Call</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
