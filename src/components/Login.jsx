import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
        <div className="flex flex-col items-center justify-center pt-12 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-6xl font-black tracking-tighter">
              <span className="text-primary">Go</span><span className="text-on-surface">Stret</span>
            </h1>
          </div>
          <p className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.5em] opacity-60">Authentication Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex max-w-[420px] flex-col gap-6 px-8 py-4 mx-auto w-full">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-error/10 text-error p-4 rounded-2xl text-xs font-bold border border-error/20 mb-2 text-center"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-5">
            <label className="flex flex-col gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Email Address</span>
              <input
                type="email"
                placeholder="name@example.com"
                className="form-input w-full rounded-2xl text-on-surface focus:outline-none bg-surface-container h-16 placeholder:text-on-surface/20 px-6 text-base font-bold transition-all border border-white/5 focus:border-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input w-full rounded-2xl text-on-surface focus:outline-none bg-surface-container h-16 placeholder:text-on-surface/20 px-6 text-base font-bold transition-all border border-white/5 focus:border-primary/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="flex py-4 w-full mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full teal-pulse-gradient text-base/90 text-on-background font-black rounded-pill h-16 shadow-teal-glow uppercase tracking-[0.2em] disabled:opacity-50 transition-all"
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </motion.button>
          </div>
        </form>
      </div>

      <div className="pb-12 pt-8 px-4 text-center">
        <p className="text-on-surface-variant text-[11px] font-black uppercase tracking-[0.2em]">
          New to GoStret? <span onClick={() => navigate('/signup')} className="text-primary cursor-pointer hover:opacity-80 transition-opacity ml-2">Create Account</span>
        </p>
      </div>
    </motion.div>
  );
}
