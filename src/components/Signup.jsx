import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!agree) {
      setError('Please agree to the terms and conditions');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await authService.signup({
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: 'rider'
      });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4 max-w-[480px] mx-auto w-full px-4 pt-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold border border-red-100 mb-2">
              {error}
            </div>
          )}
          
          <div className="flex gap-4">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="First name"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border border-neutral-200 shadow-sm h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="Last name"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border border-neutral-200 shadow-sm h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="email"
              placeholder="Email address"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border border-neutral-200 shadow-sm h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="password"
              placeholder="Password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c170d] focus:outline-none focus:ring-2 focus:ring-[#D9483E] border border-neutral-200 shadow-sm h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="py-2 w-full">
            <label className="flex gap-x-3 flex-row items-center cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 rounded border-neutral-200 border-2 bg-transparent text-[#D9483E] checked:bg-[#D9483E] checked:border-[#D9483E] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-neutral-200 focus:outline-none transition-colors"
                required
              />
              <p className="text-[#1c170d] text-base font-normal leading-normal select-none">I agree to the Terms of Service and Privacy Policy</p>
            </label>
          </div>

          <div className="flex py-3 w-full mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#D9483E] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#C53D34] hover:shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="truncate">{loading ? 'Creating account...' : 'Sign up'}</span>
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <p onClick={() => navigate('/login')} className="text-[#9b844b] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer hover:text-[#7a683a] mb-4">Already have an account? Sign in</p>
        <div className="h-5 bg-white"></div>
      </div>
    </motion.div>
  );
}
