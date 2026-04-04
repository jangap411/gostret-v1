import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

export default function Login() {
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
        <div className="flex flex-col items-center justify-center pt-16 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-[#1D3557]">Go</span><span className="text-[#D9483E]">Stret</span>
            </h1>
            {/* <span className="text-3xl">🥎</span> */}
          </div>
          <h2 className="text-[#1c170d] text-2xl font-bold mt-4 tracking-tight">Login to Your Account</h2>
        </div>
        <div className="flex max-w-[480px] flex-col gap-5 px-6 py-4 mx-auto w-full mt-4">
          <label className="flex flex-col flex-1 gap-2">
            <span className="text-sm font-semibold text-neutral-700">Username</span>
            <input
              placeholder="Enter your username"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border border-neutral-200 bg-white h-14 placeholder:text-neutral-400 p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
          <label className="flex flex-col flex-1 gap-2">
            <span className="text-sm font-semibold text-neutral-700">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border border-neutral-200 bg-white h-14 placeholder:text-neutral-400 p-4 text-base font-normal leading-normal transition"
              defaultValue=""
            />
          </label>
        </div>
        <div className="flex px-6 py-3 max-w-[480px] mx-auto w-full mt-2">
          <button
            onClick={() => { localStorage.setItem('isAuthenticated', 'true'); navigate('/'); }}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 flex-1 bg-[#D9483E] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#C53D34] shadow-md hover:shadow-lg transition-all"
          >
            <span className="truncate">Login</span>
          </button>
        </div>
      </div>
      <div>
        <p className="text-neutral-500 text-[15px] font-normal leading-normal pb-8 pt-8 px-4 text-center mb-4">
          Don't have an account? <span onClick={() => navigate('/signup')} className="text-[#D9483E] font-semibold cursor-pointer hover:text-[#C53D34] transition-colors">Register</span>
        </p>
      </div>
    </motion.div>
  );
}
