import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const INITIAL_METHODS = [
  { id: '1', type: 'Credit Card', brand: 'Visa', last4: '4567', icon: 'payments', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: '2', type: 'Debit Card', brand: 'Mastercard', last4: '1234', icon: 'credit_card', color: 'text-orange-500', bg: 'bg-orange-50' },
];

const DIGITAL_WALLETS = [
  { id: 'w1', name: 'Yumipei', icon: 'Yu', bg: 'bg-slate-800', color: 'text-slate-400', identifier: '+675 7000 1234' },
  { id: 'w2', name: 'Cellmoni', icon: 'Ce', bg: 'bg-slate-800', color: 'text-slate-400', identifier: '+675 7100 5678' },
];

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [editingMethod, setEditingMethod] = useState(null); 
  const [editingWallet, setEditingWallet] = useState(null); 
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [formData, setFormData] = useState({ brand: '', last4: '', type: 'Credit Card' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const profile = await userService.getProfile(token);
        setWalletBalance(profile.wallet_balance || 0);
      } catch (error) {
        console.error("Balance fetch error", error);
      }
    };
    fetchBalance();
  }, []);

  const handleEdit = (method) => {
    setEditingMethod(method.id);
    setFormData({ brand: method.brand, last4: method.last4, type: method.type });
  };

  const handleAdd = () => {
    setEditingMethod('new');
    setFormData({ brand: '', last4: '', type: 'Credit Card' });
  };

  const handleSave = () => {
    if (editingMethod === 'new') {
      const newMethod = {
        id: Date.now().toString(),
        ...formData,
        icon: 'credit_card',
        color: 'text-slate-400',
        bg: 'bg-slate-50'
      };
      setMethods([...methods, newMethod]);
    } else {
      setMethods(methods.map(m => m.id === editingMethod ? { ...m, ...formData } : m));
    }
    setEditingMethod(null);
  };

  const handleTopUp = async () => {
    if (!topUpAmount || isNaN(topUpAmount) || parseFloat(topUpAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await userService.topUpWallet(parseFloat(topUpAmount), token);
      setWalletBalance(data.wallet_balance);
      setIsTopUpOpen(false);
      setTopUpAmount('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setMethods(methods.filter(m => m.id !== id));
    setEditingMethod(null);
  };

  const getTitle = () => {
    if (editingMethod) return editingMethod === 'new' ? 'ADD CARD' : 'EDIT CARD';
    if (editingWallet) return 'WALLET INFO';
    if (isTopUpOpen) return 'TOP UP';
    return 'PAYMENTS';
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-background text-on-surface font-body h-full flex flex-col relative overflow-hidden"
    >
      {/* PREMIUM HEADER - GLASSMORPHISM */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (editingMethod) setEditingMethod(null);
            else if (editingWallet) setEditingWallet(null);
            else if (isTopUpOpen) setIsTopUpOpen(false);
            else navigate(-1);
          }} 
          className="size-11 rounded-2xl bg-surface border border-white/20 flex items-center justify-center text-slate-400 shadow-sm"
        >
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </motion.button>
        <h2 className="text-sm font-black tracking-[0.2em] uppercase text-on-surface">
          {getTitle()}
        </h2>
        <div className="size-11"></div> {/* Spacer */}
      </header>

      <main className="flex-1 pt-24 pb-32 px-6 overflow-y-auto no-scrollbar max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {!editingMethod && !editingWallet && !isTopUpOpen ? (
            <motion.div 
              key="main-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* WALLET BALANCE CARD */}
              <section className="bg-surface rounded-[40px] p-8 shadow-premium border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                
                <div className="relative z-10">
                  <p className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Digital Wallet</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-black text-white/40 tracking-tighter uppercase">PGK</span>
                    <h3 className="text-5xl font-black text-on-surface tracking-tighter leading-none">
                      {parseFloat(walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsTopUpOpen(true)}
                    className="w-full mt-10 h-16 bg-slate-100 text-slate-900 rounded-[24px] font-black text-lg shadow-premium flex items-center justify-center gap-3 border-b-4 border-slate-400"
                  >
                    <span className="material-symbols-outlined font-black">add</span>
                    <span>Top Up Wallet</span>
                  </motion.button>
                </div>
              </section>

              {/* CARD LIST */}
              <section>
                <div className="flex items-center justify-between mb-5 px-2">
                  <h4 className="text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Saved Cards</h4>
                  <div className="size-2 bg-slate-400/20 rounded-full"></div>
                </div>
                
                <div className="bg-surface rounded-[40px] border border-white/20 shadow-premium overflow-hidden divide-y divide-white/5">
                  {methods.map((method) => (
                    <motion.button 
                      key={method.id} 
                      whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      onClick={() => handleEdit(method)}
                      className="w-full flex items-center justify-between p-6 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`size-12 rounded-[18px] bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-slate-50 group-hover:text-slate-800 transition-colors`}>
                          <span className="material-symbols-outlined font-black text-2xl">{method.icon}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-black text-on-surface group-hover:text-white tracking-[0.1em] uppercase transition-colors">{method.type}</p>
                          <p className="text-slate-500 font-bold text-xs mt-1">{method.brand} •••• {method.last4}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
                    </motion.button>
                  ))}

                  <motion.button 
                    onClick={handleAdd}
                    whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    className="w-full flex items-center gap-5 p-6 transition-all group"
                  >
                    <div className="size-12 rounded-[18px] bg-slate-800 border-2 border-dashed border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-slate-50 group-hover:text-slate-800 group-hover:border-solid transition-all">
                      <span className="material-symbols-outlined font-black">add</span>
                    </div>
                    <span className="font-black text-on-surface group-hover:text-white tracking-[0.1em] uppercase text-[11px] transition-colors">Add New Card</span>
                  </motion.button>
                </div>
              </section>

              {/* DIGITAL WALLETS */}
              <section>
                <h4 className="px-2 mb-5 text-slate-400 text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Other Methods</h4>
                <div className="grid grid-cols-2 gap-4">
                  {DIGITAL_WALLETS.map((wallet) => (
                    <motion.button
                      key={wallet.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingWallet(wallet)}
                      className="bg-surface p-6 rounded-[32px] border border-white/20 shadow-sm flex flex-col items-center gap-4 text-center group"
                    >
                      <div className={`size-14 rounded-2xl ${wallet.bg} flex items-center justify-center ${wallet.color} font-black text-xl shadow-sm group-hover:bg-slate-50 group-hover:text-slate-800 transition-colors`}>
                        {wallet.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-on-surface group-hover:text-white text-[10px] uppercase tracking-widest transition-colors">{wallet.name}</p>
                        <p className="text-slate-500 font-bold text-[9px] opacity-60">Linked</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : isTopUpOpen ? (
            <motion.div 
              key="top-up-flow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-surface rounded-[40px] p-8 shadow-premium border border-white/20 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase ml-2 opacity-80">Enter Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-600">PGK</span>
                    <input 
                      type="number"
                      placeholder="0.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full h-24 bg-slate-800/50 border border-white/10 rounded-[32px] pl-20 pr-6 text-4xl font-black text-on-surface focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-slate-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[20, 50, 100, 200, 500, 1000].map(amt => (
                    <motion.button 
                      key={amt}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTopUpAmount(amt.toString())}
                      className={`h-14 rounded-2xl font-black text-xs transition-all border-b-2 ${
                        topUpAmount === amt.toString() 
                          ? 'bg-slate-100 text-slate-900 border-slate-400 shadow-md' 
                          : 'bg-slate-800 border-white/5 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      {amt}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={handleTopUp}
                  className="w-full h-18 bg-slate-100 text-slate-900 font-black rounded-[28px] text-xl shadow-premium flex items-center justify-center gap-3 border-b-4 border-slate-400"
                >
                  {loading ? (
                    <div className="size-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  ) : 'Confirm Deposit'}
                </motion.button>
                <button 
                  onClick={() => setIsTopUpOpen(false)}
                  className="w-full h-14 text-slate-500 font-black text-[10px] tracking-[0.2em] uppercase"
                >
                  CANCEL TRANSACTION
                </button>
              </div>
            </motion.div>
          ) : editingMethod ? (
            <motion.div 
              key="edit-card-flow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="bg-surface p-8 rounded-[40px] shadow-premium border border-white/20 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase ml-2">Card Network</label>
                  <input 
                    type="text"
                    placeholder="Visa, Mastercard, etc."
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full h-16 bg-slate-800/50 border border-white/10 rounded-2xl px-6 text-on-surface font-bold focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-slate-400 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase ml-2">Last 4 Digits</label>
                  <input 
                    type="text"
                    placeholder="4567"
                    maxLength={4}
                    value={formData.last4}
                    onChange={(e) => setFormData({ ...formData, last4: e.target.value.replace(/\D/g, '') })}
                    className="w-full h-16 bg-slate-800/50 border border-white/10 rounded-2xl px-6 text-on-surface font-bold focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full h-18 bg-slate-100 text-slate-900 font-black rounded-[28px] text-lg shadow-premium border-b-4 border-slate-400"
                >
                  Save Method
                </motion.button>
                {editingMethod !== 'new' && (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(editingMethod)}
                    className="w-full h-14 bg-slate-800 text-slate-400 font-black text-[10px] tracking-[0.25em] uppercase rounded-2xl border border-white/5 hover:bg-slate-700 hover:text-white"
                  >
                    Delete Card
                  </motion.button>
                )}
                <button 
                  onClick={() => setEditingMethod(null)}
                  className="w-full h-14 text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="wallet-info-flow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12 py-6"
            >
              <div className="flex flex-col items-center gap-6 text-center">
                <div className={`size-32 rounded-[40px] ${editingWallet.bg} flex items-center justify-center ${editingWallet.color} font-black text-4xl shadow-premium border border-white/20`}>
                  {editingWallet.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-on-surface tracking-tighter">{editingWallet.name}</h3>
                  <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60">Connected Wallet</p>
                </div>
              </div>

              <div className="bg-surface rounded-[40px] p-8 border border-white/20 shadow-sm space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Linked Account</label>
                  <div className="w-full h-16 bg-slate-800/50 border border-white/5 rounded-2xl flex items-center px-6">
                    <p className="text-on-surface font-black text-lg">{editingWallet.identifier}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Status</label>
                  <div className="w-full h-16 bg-slate-800/50 border border-white/5 rounded-2xl flex items-center px-6 justify-between">
                    <p className="text-success font-black text-lg">Verified</p>
                    <div className="size-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    alert(`${editingWallet.name} unlinked`);
                    setEditingWallet(null);
                  }}
                  className="w-full h-16 bg-slate-800 text-slate-400 font-black text-[11px] tracking-[0.25em] uppercase rounded-[28px] border border-white/5 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Unlink Account
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingWallet(null)}
                  className="w-full h-18 bg-slate-100 text-slate-900 font-black rounded-[28px] text-lg shadow-premium border-b-4 border-slate-400"
                >
                  Back to Payments
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
