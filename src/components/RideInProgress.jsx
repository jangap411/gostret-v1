import BottomNav from './BottomNav';
import React from 'react';
import { motion } from 'framer-motion';
import MapView from './MapView';

const pageVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 }
};

export default function RideInProgress() {
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
        <div className="@container flex flex-col h-full flex-1">
          <div className="flex flex-1 flex-col @[480px]:px-4 @[480px]:py-3 h-screen">
            <div
              className="relative flex min-h-[320px] h-full flex-1 flex-col justify-between px-4 pb-4 pt-5 @[480px]:rounded-xl @[480px]:px-8 @[480px]:pb-6 @[480px]:pt-8 fixed inset-0 z-0 bg-neutral-200 overflow-hidden"
            >
              <MapView className="absolute inset-0 w-full h-full z-0" zoom={15} />
              
              <div className="relative z-10 w-full pointer-events-auto">
                <label className="flex flex-col min-w-40 h-12 shadow-md rounded-xl hover:shadow-lg transition-shadow mt-4">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full overflow-hidden bg-neutral-50">
                    <div
                      className="text-neutral-500 flex border-none bg-neutral-50 items-center justify-center pl-4 rounded-l-xl border-r-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                      </svg>
                    </div>
                    <input
                      placeholder="Where to?"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-0 focus:ring-0 border-none bg-neutral-50 h-full placeholder:text-neutral-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-col items-end gap-3 mb-48 pointer-events-none relative z-10">
                <div className="flex flex-col gap-0.5 pointer-events-auto">
                  <button className="flex size-10 items-center justify-center rounded-t-xl bg-neutral-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-neutral-100 transition">
                    <div className="text-[#141414]" data-icon="Plus" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                      </svg>
                    </div>
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-b-xl bg-neutral-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-neutral-100 transition">
                    <div className="text-[#141414]" data-icon="Minus" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <button className="flex size-10 items-center justify-center rounded-xl bg-neutral-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)] pointer-events-auto hover:bg-neutral-100 transition">
                  <div className="text-[#141414]" data-icon="NavigationArrow" data-size="24px" data-weight="regular">
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
      
      {/* Bottom Sheet */}
      <div className="absolute bottom-[66px] left-0 w-full z-10">
        <div className="flex w-full flex-col justify-end items-stretch rounded-t-3xl overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-stretch bg-neutral-50 pb-5">
            <button className="flex h-5 w-full items-center justify-center cursor-pointer hover:bg-neutral-100 transition"><div className="h-1 w-9 rounded-full bg-[#dbdbdb]"></div></button>
            <div className="flex-1">
              <div className="flex items-center gap-4 bg-neutral-50 px-5 min-h-[72px] py-2">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCX4MFPG__CP8hv3NREftjc7Xf56xLws6CKcmbiHJK3xvmZjUW02Q34ckm4C4Vm6WwC_78bpqrvb-ASwP8tjd889_wrLEYEnM83inxKtCc_UFsF8AN3HdoYO86EKOGnGrPI3G_KiJklXFA5PaNYQJFZftxUfyXz9qFKFxWDqk8Z0y_tf-7T72mlLeRWvIqa00A7TTZ9VI-ynxZWENRlny0s_qJ7V7XClXp18_k73Vw_xQZKvJOmBx8Q_kiuz7_pXf2QZ2cYh8l9818")' }}
                ></div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">Rider</p>
                  <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">Toyota Camry</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-neutral-50 px-5 min-h-[72px] py-2">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2oslRnJMDapk8mUtGAG2ulSySsomThb6FFTIYOgF-loqFxCAL-g903h4rsl-XsPYWEqqlxkGOJyx_U5VWdX0jwBt9mN66iJlWbVPWW5wsaDqwCW-eVxBQcjk_AtpH_a43OZk0zKkPhgTHVY5QHcxX6SsECeqeJFGWUeIWgiGL26a_Jy5QwHdsfBFN0ncWhclkBehTYtlC5QBN_JJa8swOVJPCXWxPUzaFT3vza_JdIDM38ZvGI_25A9uaeH95DeynfGawW5zLXpU")' }}
                ></div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">Driver</p>
                  <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">Arriving in 2 min</p>
                </div>
              </div>
              <div className="flex justify-stretch">
                <div className="flex flex-1 gap-3 px-5 py-3 justify-between">
                  <button
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 flex-1 bg-[#D9483E] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#C53D34] transition"
                  >
                    <span className="truncate">Message</span>
                  </button>
                  <button
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 flex-1 bg-neutral-100 text-[#1D3557] text-base font-bold leading-normal tracking-[0.015em] hover:bg-neutral-200 transition"
                  >
                    <span className="truncate">Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </motion.div>
  );
}
