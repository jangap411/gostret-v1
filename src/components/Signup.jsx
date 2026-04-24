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
      className="relative flex size-full min-h-screen flex-col bg-base justify-between group/design-root overflow-x-hidden font-body text-on-surface"
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-5xl font-black tracking-tighter">
              <span className="text-primary">Go</span><span className="text-on-surface">Stret</span>
            </h1>
          </div>
          <p className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.5em] opacity-60">Create Your Journey</p>
        </div>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-5 max-w-[440px] mx-auto w-full px-8 py-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-error/10 text-error p-4 rounded-2xl text-xs font-bold border border-error/20 mb-2 text-center"
            >
              {error}
            </motion.div>
          )}
          
          <div className="flex gap-4">
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">First Name</span>
              <input
                placeholder="John"
                className="form-input w-full rounded-2xl text-on-surface focus:outline-none bg-surface-container h-14 placeholder:text-on-surface/20 px-5 text-base font-bold transition-all border border-white/5"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Last Name</span>
              <input
                placeholder="Doe"
                className="form-input w-full rounded-2xl text-on-surface focus:outline-none bg-surface-container h-14 placeholder:text-on-surface/20 px-5 text-base font-bold transition-all border border-white/5"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Email Address</span>
            <input
              type="email"
              placeholder="name@example.com"
              className="form-input w-full rounded-2xl text-on-surface focus:outline-none bg-surface-container h-14 placeholder:text-on-surface/20 px-5 text-base font-bold transition-all border border-white/5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input w-full rounded-2xl text-on-surface focus:outline-none bg-surface-container h-14 placeholder:text-on-surface/20 px-5 text-base font-bold transition-all border border-white/5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="py-2 w-full">
            <label className="flex gap-x-4 flex-row items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-6 w-6 rounded-lg border-white/10 border-2 bg-surface-container text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-base after:text-base after:font-black"
                  required
                />
              </div>
              <p className="text-on-surface-variant text-[11px] font-bold leading-tight select-none opacity-80 group-hover:opacity-100 transition-opacity">I agree to the <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span></p>
            </label>
          </div>

          <div className="flex py-4 w-full mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full teal-pulse-gradient text-base/90 text-on-background font-black rounded-pill h-16 shadow-teal-glow uppercase tracking-[0.2em] disabled:opacity-50 transition-all"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </motion.button>
          </div>
        </form>
      </div>
      
      <div className="pb-12 pt-4 px-4 text-center">
        <p className="text-on-surface-variant text-[11px] font-black uppercase tracking-[0.2em]">
          Already have an account? <span onClick={() => navigate('/login')} className="text-primary cursor-pointer hover:opacity-80 transition-opacity ml-2">Sign In</span>
        </p>
      </div>
    </motion.div>
  );
}
