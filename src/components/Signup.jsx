import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function Signup() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-[#fcfbf8] justify-between group/design-root overflow-x-hidden"
      style={{
        '--checkbox-tick-svg': `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(28,23,13)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')`,
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'
      }}
    >
      <div>
        <div className="flex items-center bg-[#fcfbf8] p-4 pb-2 justify-end">
          <div className="flex w-12 items-center justify-end">
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-[#1c170d] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-neutral-200 transition"
            >
              <div className="text-[#1c170d]" data-icon="Question" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
        <h2 className="text-[#1c170d] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5 max-w-[480px] mx-auto w-full">Create your account</h2>
        
        <div className="flex flex-col gap-4 max-w-[480px] mx-auto w-full px-4 pt-4">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="First name"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#f4c653] border-none bg-[#f3f0e7] h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Last name"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#f4c653] border-none bg-[#f3f0e7] h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Email or phone number"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#f4c653] border-none bg-[#f3f0e7] h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="password"
              placeholder="Password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#f4c653] border-none bg-[#f3f0e7] h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
        </div>

        <div className="px-4 py-3 max-w-[480px] mx-auto mt-2 w-full">
          <label className="flex gap-x-3 flex-row items-center cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[#e8e1cf] border-2 bg-transparent text-[#f4c653] checked:bg-[#f4c653] checked:border-[#f4c653] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#e8e1cf] focus:outline-none transition-colors"
            />
            <p className="text-[#1c170d] text-base font-normal leading-normal select-none">I agree to the Terms of Service and Privacy Policy</p>
          </label>
        </div>

        <div className="flex px-4 py-3 max-w-[480px] mx-auto w-full mt-4">
          <button
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#f4c653] text-[#1c170d] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#eab332] hover:shadow-lg transition-all"
          >
            <span className="truncate">Sign up</span>
          </button>
        </div>
      </div>
      
      <div>
        <p className="text-[#9b844b] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer hover:text-[#7a683a] mb-4">Already have an account? Sign in</p>
        <div className="h-5 bg-[#fcfbf8]"></div>
      </div>
    </motion.div>
  );
}
