import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

export default function Login() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-[#fcfbf8] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-[#fcfbf8] p-4 pb-2 justify-between">
          <button className="text-[#1c170d] flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-neutral-200 transition" data-icon="ArrowLeft" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#1c170d] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Welcome back</h2>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto mt-8">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Email or phone"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#f4c653] border-none bg-[#f3f0e7] h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="password"
              placeholder="Password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#f4c653] border-none bg-[#f3f0e7] h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
        </div>
        <p className="text-[#9b844b] text-sm font-normal leading-normal pb-3 pt-1 px-4 underline cursor-pointer hover:text-[#7a683a] text-center max-w-[480px] mx-auto text-right w-full block">Forgot password?</p>
        <div className="flex px-4 py-3 max-w-[480px] mx-auto w-full mt-4">
          <button
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#f4c653] text-[#1c170d] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#eab332] hover:shadow-lg transition-all"
          >
            <span className="truncate">Continue</span>
          </button>
        </div>
        <p className="text-[#9b844b] text-sm font-normal leading-normal pb-3 pt-4 px-4 text-center mt-8">Or connect with</p>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center w-full">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-4 bg-[#f3f0e7] text-[#1c170d] text-sm font-bold leading-normal tracking-[0.015em] grow hover:bg-[#e8e4d8] transition"
            >
              <span className="truncate">Facebook</span>
            </button>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-4 bg-[#f3f0e7] text-[#1c170d] text-sm font-bold leading-normal tracking-[0.015em] grow hover:bg-[#e8e4d8] transition"
            >
              <span className="truncate">Apple</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[#9b844b] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer hover:text-[#7a683a] mb-4">Don't have an account? Sign up</p>
        <div className="h-5 bg-[#fcfbf8]"></div>
      </div>
    </motion.div>
  );
}
