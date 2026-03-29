import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function Signup() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{
        '--checkbox-tick-svg': `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(28,23,13)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')`,
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'
      }}
    >
      <div>
        <div className="flex flex-col items-center justify-center pt-10 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-[#1D3557]">Go</span><span className="text-[#D9483E]">Stret</span>
            </h1>
            <span className="text-3xl">🥎</span>
          </div>
          <h2 className="text-[#1c170d] tracking-tight text-[28px] font-bold leading-tight px-4 text-center mt-2 max-w-[480px] mx-auto w-full">Create your account</h2>
        </div>
        
        <div className="flex flex-col gap-4 max-w-[480px] mx-auto w-full px-4 pt-4">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="First name"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border-none bg-white border border-neutral-200 shadow-sm h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Last name"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border-none bg-white border border-neutral-200 shadow-sm h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              placeholder="Email or phone number"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border-none bg-white border border-neutral-200 shadow-sm h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="password"
              placeholder="Password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border-none bg-white border border-neutral-200 shadow-sm h-14 placeholder:text-[#9b844b] p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
        </div>

        <div className="px-4 py-3 max-w-[480px] mx-auto mt-2 w-full">
          <label className="flex gap-x-3 flex-row items-center cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-neutral-200 border-2 bg-transparent text-[#D9483E] checked:bg-[#D9483E] checked:border-[#D9483E] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-neutral-200 focus:outline-none transition-colors"
            />
            <p className="text-[#1c170d] text-base font-normal leading-normal select-none">I agree to the Terms of Service and Privacy Policy</p>
          </label>
        </div>

        <div className="flex px-4 py-3 max-w-[480px] mx-auto w-full mt-4">
          <button
            onClick={() => { localStorage.setItem('isAuthenticated', 'true'); navigate('/'); }}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#D9483E] text-[#1c170d] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#C53D34] hover:shadow-lg transition-all"
          >
            <span className="truncate">Sign up</span>
          </button>
        </div>
      </div>
      
      <div>
        <p onClick={() => navigate('/login')} className="text-[#9b844b] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer hover:text-[#7a683a] mb-4">Already have an account? Sign in</p>
        <div className="h-5 bg-white"></div>
      </div>
    </motion.div>
  );
}
