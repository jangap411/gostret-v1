import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function SearchLocation() {
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
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between">
          <button className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full" data-icon="List" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Where to?</h2>
        </div>

        {/* Inputs */}
        <div className="px-4 flex flex-col gap-3 py-3 w-full max-w-[600px] mx-auto">
          <label className="flex flex-col min-w-40 h-14 w-full group relative shadow-sm hover:shadow-md transition">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-transparent group-hover:border-neutral-300 overflow-hidden">
              <div
                className="text-neutral-500 flex border-none bg-[#ededed] items-center justify-center pl-4 pr-2"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="40"></circle>
                </svg>
              </div>
              <input
                placeholder="Enter pickup location"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-none focus:ring-0 border-none bg-[#ededed] h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal transition"
                defaultValue=""
              />
            </div>
          </label>
          <label className="flex flex-col min-w-40 h-14 w-full group relative shadow-sm hover:shadow-md transition">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-transparent group-focus-within:border-neutral-800 overflow-hidden">
              <div
                className="text-neutral-500 flex border-none bg-[#ededed] items-center justify-center pl-4 pr-2"
                data-icon="MagnifyingGlass" data-size="24px" data-weight="regular"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Enter destination"
                autoFocus
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#141414] focus:outline-none focus:ring-0 border-none bg-[#ededed] h-full placeholder:text-neutral-500 px-4 text-base font-normal leading-normal transition"
                defaultValue=""
              />
            </div>
          </label>
        </div>

        {/* Map Area */}
        <div className="flex flex-col flex-1 pb-4">
          <div className="flex flex-1 flex-col px-4">
            <div
              className="bg-cover bg-center flex min-h-[320px] flex-1 flex-col justify-between px-4 pb-4 pt-5 rounded-2xl overflow-hidden shadow-inner object-cover"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaO2lWOyQgbcICo0pdEX2TCp9_OoF61BpaIFoo33dE5hTx5-4RPh8jGK-Dv7qN_-kOXJAsawQeZB65Sb-YiYKxMm0WCVnwLJ1RMC0BGzf7LXhxPzfmtkeGwfXkjk7UZMjsjKOf0mZVJcoFWpeAXDE7hfhwnrkyl6PUQSWMR2Pe9fszES1gqG6al4RjF51jM2pBBOQZB2ppzrQYR0lk_e2XYDey-_sBHtjDrs2q7aveS42YwJihbFY7Xxr66YMfyrzch1Qyir5htvQ")' }}
            >
              <div className="flex flex-col items-end gap-3 self-end mt-auto mb-2">
                <div className="flex flex-col gap-[1px] bg-neutral-300 rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                  <button className="flex size-10 items-center justify-center bg-white hover:bg-neutral-50 transition">
                    <div className="text-[#141414]" data-icon="Plus" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                      </svg>
                    </div>
                  </button>
                  <button className="flex size-10 items-center justify-center bg-white hover:bg-neutral-50 transition">
                    <div className="text-[#141414]" data-icon="Minus" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <button className="flex size-12 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-neutral-50 transition mt-2">
                  <div className="text-[#141414]" data-icon="NavigationArrow" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" transform="scale(-1, 1)">
                      <path d="M229.33,98.21,53.41,33l-.16-.05A16,16,0,0,0,32.9,53.25a1,1,0,0,0,.05.16L98.21,229.33A15.77,15.77,0,0,0,113.28,240h.3a15.77,15.77,0,0,0,15-11.29l23.56-76.56,76.56-23.56a16,16,0,0,0,.62-30.38ZM224,113.3l-76.56,23.56a16,16,0,0,0-10.58,10.58L113.3,224h0l-.06-.17L48,48l175.82,65.22.16.06Z"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto z-10">
        <div className="flex justify-end px-5 pb-5">
          <button
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 w-14 shadow-lg bg-[#141414] text-neutral-50 text-base font-bold transition hover:scale-105 hover:shadow-xl"
          >
            <div className="text-neutral-50" data-icon="Target" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
