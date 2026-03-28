import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <div className="text-[#111518] flex size-12 shrink-0 items-center cursor-pointer hover:bg-neutral-100 rounded-full justify-center transition-colors" data-icon="List" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
          </div>
          <h2 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Where to?</h2>
        </div>
        <div className="px-4 py-3 relative z-10">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm hover:shadow transition-shadow bg-[#f0f3f4] overflow-hidden">
              <div
                className="text-[#637888] flex border-none bg-transparent items-center justify-center pl-4 pr-1"
                data-icon="MagnifyingGlass"
                data-size="24px"
                data-weight="regular"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Enter pickup location"
                onClick={() => navigate('/search-location')}
                readOnly
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111518] focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-[#637888] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal cursor-pointer"
                defaultValue=""
              />
            </div>
          </label>
        </div>
        <div className="px-4 py-1 relative z-10">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm hover:shadow transition-shadow bg-[#f0f3f4] overflow-hidden">
              <div
                className="text-[#637888] flex border-none bg-transparent items-center justify-center pl-4 pr-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Enter destination"
                onClick={() => navigate('/search-location')}
                readOnly
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111518] focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-[#637888] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal cursor-pointer"
                defaultValue=""
              />
            </div>
          </label>
        </div>
        
        {/* Dynamic Interactive React-Leaflet Map replaces static background */}
        <div className="@container flex flex-col h-full flex-1 mt-4 relative z-0">
          <div className="flex flex-1 flex-col @[480px]:px-4 @[480px]:py-3 h-full">
            <div className="relative flex min-h-[360px] flex-1 flex-col justify-between pb-4 pt-5 shadow-inner @[480px]:rounded-xl @[480px]:pb-6 @[480px]:pt-8 overflow-hidden bg-neutral-200">
              
              <MapView center={[-9.43869006941101,147.1810054779053]} zoom={13} className="absolute inset-0 w-full h-full z-0" />
              
              <div className="w-full px-4 relative z-10">
                <label className="flex flex-col min-w-40 h-14 shadow-md rounded-xl hover:shadow-lg transition-shadow bg-white overflow-hidden">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                    <div
                      className="text-[#637888] flex border-none bg-white items-center justify-center pl-4 pr-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                      </svg>
                    </div>
                    <input
                      placeholder="Search for a location"
                      onClick={() => navigate('/search-location')}
                      readOnly
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111518] focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-[#637888] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal cursor-pointer"
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-col items-end gap-3 pointer-events-none relative z-10 px-4 mt-auto mb-2">
                <button className="flex size-12 hover:bg-neutral-100 transition-colors pointer-events-auto cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                  <div className="text-[#111518]" data-icon="NavigationArrow" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256" transform="scale(-1, 1)">
                      <path d="M229.33,98.21,53.41,33l-.16-.05A16,16,0,0,0,32.9,53.25a1,1,0,0,0,.05.16L98.21,229.33A15.77,15.77,0,0,0,113.28,240h.3a15.77,15.77,0,0,0,15-11.29l23.56-76.56,76.56-23.56a16,16,0,0,0,.62-30.38ZM224,113.3l-76.56,23.56a16,16,0,0,0-10.58,10.58L113.3,224h0l-.06-.17L48,48l175.82,65.22.16.06Z"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-end overflow-hidden px-5 pb-5 absolute bottom-24 right-0 pointer-events-none z-20">
          <button className="flex max-w-[480px] pointer-events-auto hover:bg-[#2580c4] hover:shadow-lg transition-all cursor-pointer items-center justify-center overflow-hidden rounded-full h-16 w-16 bg-[#309be8] text-white text-base font-bold leading-normal tracking-[0.015em] min-w-0 shadow-md">
            <div className="text-white" data-icon="Target" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"></path>
              </svg>
            </div>
          </button>
        </div>
        <div className="flex gap-2 border-t border-[#f0f3f4] bg-white px-4 pb-3 pt-2 relative z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-[#111518]" to="/">
            <div className="text-[#111518] flex h-8 items-center justify-center" data-icon="House" data-size="24px" data-weight="fill">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
              </svg>
            </div>
            <p className="text-[#111518] text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637888] hover:text-[#111518] transition-colors" to="/ride-in-progress">
            <div className="flex h-8 items-center justify-center" data-icon="Car" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Rides</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637888] hover:text-[#111518] transition-colors" to="/payment-methods">
            <div className="flex h-8 items-center justify-center" data-icon="Wallet" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,128H56a8,8,0,0,1-8-8V86.63A23.84,23.84,0,0,0,56,88H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,140Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Wallet</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637888] hover:text-[#111518] transition-colors" to="/activity">
            <div className="flex h-8 items-center justify-center" data-icon="ClockCounterClockwise" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Activity</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637888] hover:text-[#111518] transition-colors" to="/account">
            <div className="flex h-8 items-center justify-center" data-icon="User" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Account</p>
          </Link>
        </div>
        <div className="h-5 bg-white relative z-50"></div>
      </div>
    </motion.div>
  );
}
