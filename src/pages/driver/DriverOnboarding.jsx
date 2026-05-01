import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const DriverOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    licenseNumber: '',
    dob: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    plateNumber: '',
    vehicleColor: '',
    category: 'regular'
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await driverService.registerDriver(formData, token);
      nextStep(); // Move to document upload or success
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
      className="bg-base text-on-surface h-screen font-body flex flex-col relative overflow-hidden"
    >
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      {/* HEADER */}
      <header className="relative z-20 px-6 pt-8 pb-4 flex items-center justify-between glass-nav">
        <button onClick={() => step === 1 ? navigate(-1) : prevStep()} className="size-12 rounded-full glass-surface flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Step {step} of 4</p>
          <div className="flex gap-1.5 mt-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-500 ${s <= step ? 'w-4 bg-primary' : 'w-2 bg-white/10'}`}></div>
            ))}
          </div>
        </div>
        <div className="size-12"></div> {/* Spacer */}
      </header>

      <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="px-8 py-10 pb-32">
          <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter leading-none">Drive & <br/><span className="text-primary">Earn More.</span></h1>
                <p className="text-on-surface-variant text-base font-medium opacity-70 leading-relaxed max-w-[280px]">
                  Join the GoStret community. Get verified in 24 hours and start accepting rides across PNG.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: 'payments', title: 'Weekly Payouts', desc: 'Directly to your bank account' },
                  { icon: 'verified_user', title: '24/7 Security', desc: 'SOS support for every trip' },
                  { icon: 'schedule', title: 'Flexible Hours', desc: 'Drive whenever you want' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-5 p-5 glass-surface rounded-[24px] border border-white/5">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-2xl font-black">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-sm tracking-tight">{feature.title}</h3>
                      <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="w-full h-18 bg-primary text-base font-black rounded-pill shadow-glow flex items-center justify-center gap-3 uppercase tracking-widest text-white"
              >
                Get Started
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter">Personal Details</h2>
                <p className="text-on-surface-variant text-sm font-medium opacity-60">We need this for legal verification.</p>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Driver's License Number</label>
                  <input 
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="DL-XXXXXXXX"
                    className="w-full h-16 glass-surface rounded-[20px] px-6 text-on-surface font-bold placeholder:text-on-surface/20 border-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Date of Birth</label>
                  <input 
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full h-16 glass-surface rounded-[20px] px-6 text-on-surface font-bold placeholder:text-on-surface/20 border-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!formData.licenseNumber || !formData.dob}
                className="w-full h-18 bg-primary text-base font-black rounded-pill shadow-glow flex items-center justify-center gap-3 uppercase tracking-widest text-white disabled:opacity-50"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter">Vehicle Info</h2>
                <p className="text-on-surface-variant text-sm font-medium opacity-60">Register the vehicle you'll be driving.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Make</label>
                  <input name="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} placeholder="Toyota" className="w-full h-14 glass-surface rounded-2xl px-5 text-sm font-bold border-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Model</label>
                  <input name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="Corolla" className="w-full h-14 glass-surface rounded-2xl px-5 text-sm font-bold border-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">License Plate</label>
                <input name="plateNumber" value={formData.plateNumber} onChange={handleInputChange} placeholder="PAV 123" className="w-full h-16 glass-surface rounded-[20px] px-6 text-on-surface font-bold border-none uppercase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Year</label>
                  <input name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} placeholder="2022" className="w-full h-14 glass-surface rounded-2xl px-5 text-sm font-bold border-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Color</label>
                  <input name="vehicleColor" value={formData.vehicleColor} onChange={handleInputChange} placeholder="Silver" className="w-full h-14 glass-surface rounded-2xl px-5 text-sm font-bold border-none" />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !formData.vehicleMake || !formData.plateNumber}
                className="w-full h-18 bg-primary text-base font-black rounded-pill shadow-glow flex items-center justify-center gap-3 uppercase tracking-widest text-white disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Vehicle'}
              </motion.button>
              {error && <p className="text-error text-center text-xs font-bold">{error}</p>}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10 py-6"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="size-28 bg-success/20 rounded-[40px] flex items-center justify-center text-success relative">
                   <span className="material-symbols-outlined text-6xl font-black">fact_check</span>
                   <span className="absolute inset-0 size-full bg-success/20 rounded-[40px] animate-ping opacity-50"></span>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tighter leading-tight text-on-surface">Documents Pending</h2>
                  <p className="text-on-surface-variant text-sm font-medium opacity-60 leading-relaxed">
                    Great start! Now we need photos of your documents to verify your account.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                 {[
                   { label: "Driver's License", status: "Required" },
                   { label: "Vehicle Registration", status: "Required" },
                   { label: "Insurance Policy", status: "Required" }
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-5 glass-surface rounded-3xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary/60">description</span>
                        <span className="font-bold text-sm">{doc.label}</span>
                      </div>
                      <button className="bg-primary/10 text-primary text-[10px] font-black uppercase px-4 py-2 rounded-xl">Upload</button>
                   </div>
                 ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="w-full h-18 glass-surface text-on-surface-variant font-black rounded-pill flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                Go to Dashboard
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
};

export default DriverOnboarding;
