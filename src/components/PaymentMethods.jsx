import { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const INITIAL_METHODS = [
  { id: '1', type: 'Credit', brand: 'Visa', last4: '4567', icon: 'visa', bg: 'bg-blue-100', text: 'text-blue-800' },
  { id: '2', type: 'Credit', brand: 'Mastercard', last4: '1234', icon: 'mastercard', bg: 'bg-orange-100', text: 'text-orange-600' },
];

const DIGITAL_WALLETS = [
  { id: 'w1', name: 'Yumipei', icon: 'Yu', bg: 'bg-green-100', identifier: '+675 7000 1234', status: 'Linked' },
  { id: 'w2', name: 'Cellmoni', icon: 'Ce', bg: 'bg-red-100', identifier: '+675 7100 5678', status: 'Linked' },
  { id: 'w3', name: 'Wantok Wallet', icon: 'Wa', bg: 'bg-yellow-100', identifier: 'wantok.user@bsp.com.pg', status: 'Linked' },
];

import { userService } from '../services/api';

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [editingMethod, setEditingMethod] = useState(null); 
  const [editingWallet, setEditingWallet] = useState(null); 
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(100);
  const [formData, setFormData] = useState({ brand: '', last4: '', type: 'Credit' });
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
    setFormData({ brand: '', last4: '', type: 'Credit' });
  };

  const handleSave = () => {
    if (editingMethod === 'new') {
      const newMethod = {
        id: Date.now().toString(),
        ...formData,
        bg: 'bg-neutral-100',
        text: 'text-neutral-800'
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
      alert("Wallet topped up successfully!");
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full h-full flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between sticky top-0 z-50">
          <button 
            onClick={() => {
              if (editingMethod) setEditingMethod(null);
              else if (editingWallet) setEditingWallet(null);
              else if (isTopUpOpen) setIsTopUpOpen(false);
              else navigate(-1);
            }} 
            className="text-[#141414] flex size-12 shrink-0 items-center cursor-pointer hover:bg-neutral-200 rounded-full justify-center transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {editingMethod ? (editingMethod === 'new' ? 'Add card' : 'Edit card') : (editingWallet ? 'Wallet details' : (isTopUpOpen ? 'Top up wallet' : 'Payment methods'))}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!editingMethod && !editingWallet && !isTopUpOpen ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
              <div className="mx-4 mt-4 p-6 bg-gradient-to-br from-[#1D3557] to-[#141414] rounded-3xl shadow-xl shadow-blue-950/20 text-white flex flex-col gap-1">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Available Balance</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-extrabold tracking-tight">${walletBalance}</h3>
                  <span className="text-sm font-medium text-blue-300 pb-1.5">PGK</span>
                </div>
                <button 
                  onClick={() => setIsTopUpOpen(true)}
                  className="mt-4 h-12 bg-[#D9483E] rounded-xl text-white font-bold text-sm shadow-lg shadow-red-950/20 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                  Top Up Now
                </button>
              </div>

              <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-8">Credit and debit cards</h3>
              
              {methods.map((method) => (
                <div 
                  key={method.id} 
                  onClick={() => handleEdit(method)}
                  className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 justify-between hover:bg-neutral-100 cursor-pointer transition border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={`bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 ${method.bg || 'bg-neutral-100'} rounded flex items-center justify-center text-[10px] font-bold ${method.text || 'text-neutral-800'}`}>
                      {method.brand?.toUpperCase() || 'CARD'}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#141414] text-base font-medium leading-normal">{method.type}</p>
                      <p className="text-neutral-500 text-sm font-normal leading-normal">{method.brand} ... {method.last4}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                  </div>
                </div>
              ))}

              <div 
                onClick={handleAdd}
                className="flex items-center gap-4 bg-neutral-50 px-4 min-h-14 justify-between hover:bg-neutral-100 cursor-pointer transition mt-2"
              >
                <div className="flex items-center gap-4">
                  <div className="text-[#D9483E] flex items-center justify-center rounded-lg bg-red-50 shrink-0 size-10 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                    </svg>
                  </div>
                  <p className="text-[#D9483E] text-base font-bold leading-normal flex-1">Add payment method</p>
                </div>
              </div>

              <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">Digital wallets</h3>
              {DIGITAL_WALLETS.map((wallet) => (
                <div key={wallet.id} onClick={() => setEditingWallet(wallet)} className="flex items-center gap-4 bg-neutral-50 px-4 min-h-14 justify-between hover:bg-neutral-100 cursor-pointer transition">
                  <div className="flex items-center gap-4">
                    <div className={`bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 ${wallet.bg} rounded flex items-center justify-center text-[10px] font-bold text-[#141414]`}>
                      {wallet.icon}
                    </div>
                    <p className="text-[#141414] text-base font-normal leading-normal">{wallet.name}</p>
                  </div>
                  <div className="shrink-0 text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : isTopUpOpen ? (
            <motion.div 
              key="topup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col px-4 pt-6 gap-8"
            >
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest pl-1">Amount to Top Up</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-neutral-400">$</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full h-20 bg-white border border-neutral-200 rounded-[28px] pl-10 pr-6 text-3xl font-extrabold text-[#141414] focus:ring-4 focus:ring-[#D9483E]/10 focus:border-[#D9483E] outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[10, 20, 50, 100, 200, 500].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className={`h-14 rounded-2xl font-bold transition flex items-center justify-center border-2 ${topUpAmount === amt.toString() ? 'bg-[#D9483E] border-[#D9483E] text-white shadow-lg shadow-red-200' : 'bg-white border-neutral-100 text-[#1D3557] hover:border-neutral-200'}`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3 pb-8">
                <button 
                  disabled={loading}
                  onClick={handleTopUp}
                  className={`w-full h-16 bg-[#D9483E] text-white font-bold rounded-2xl shadow-xl shadow-red-100 active:scale-95 transition flex items-center justify-center gap-3 ${loading ? 'opacity-70' : ''}`}
                >
                  {loading ? 'Processing...' : 'Confirm Top Up'}
                </button>
                <button 
                  onClick={() => setIsTopUpOpen(false)}
                  className="w-full h-14 bg-neutral-100 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : editingMethod ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col px-4 pt-4 gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Card Brand</label>
                <input 
                  type="text"
                  placeholder="Visa, Mastercard, etc."
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full h-14 bg-white border border-neutral-200 rounded-xl px-4 text-[#141414] font-medium focus:ring-2 focus:ring-[#D9483E]/20 focus:border-[#D9483E] outline-none transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Last 4 Digits</label>
                <input 
                  type="text"
                  placeholder="4567"
                  maxLength={4}
                  value={formData.last4}
                  onChange={(e) => setFormData({ ...formData, last4: e.target.value.replace(/\D/g, '') })}
                  className="w-full h-14 bg-white border border-neutral-200 rounded-xl px-4 text-[#141414] font-medium focus:ring-2 focus:ring-[#D9483E]/20 focus:border-[#D9483E] outline-none transition"
                />
              </div>

              <div className="mt-auto flex flex-col gap-3 pb-8">
                <button 
                  onClick={handleSave}
                  className="w-full h-14 bg-[#D9483E] text-white font-bold rounded-2xl shadow-lg shadow-red-100 active:scale-95 transition"
                >
                  Save Payment Method
                </button>
                {editingMethod !== 'new' && (
                  <button 
                    onClick={() => handleDelete(editingMethod)}
                    className="w-full h-14 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition"
                  >
                    Delete Method
                  </button>
                )}
                <button 
                  onClick={() => setEditingMethod(null)}
                  className="w-full h-14 bg-neutral-100 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="wallet-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col px-4 pt-4 gap-8"
            >
              <div className="flex flex-col items-center gap-4 py-8 bg-white rounded-3xl shadow-sm border border-neutral-100">
                <div className={`bg-center bg-no-repeat aspect-video bg-contain h-16 w-24 ${editingWallet.bg} rounded-xl flex items-center justify-center text-xl font-bold text-[#141414] shadow-sm`}>
                  {editingWallet.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#141414]">{editingWallet.name}</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 px-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Linked Account</label>
                  <div className="w-full h-16 bg-white border border-neutral-100 rounded-2xl flex items-center px-4 shadow-sm">
                    <p className="text-[#141414] font-semibold text-lg">{editingWallet.identifier}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Status</label>
                  <div className="w-full h-16 bg-white border border-neutral-100 rounded-2xl flex items-center px-4 shadow-sm justify-between">
                    <p className="text-[#141414] font-semibold text-lg">{editingWallet.status}</p>
                    <div className="size-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pb-8">
                <button 
                  onClick={() => {
                    alert(`${editingWallet.name} unlinked successfully`);
                    setEditingWallet(null);
                  }}
                  className="w-full h-14 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition shadow-sm"
                >
                  Unlink Wallet
                </button>
                <button 
                  onClick={() => setEditingWallet(null)}
                  className="w-full h-14 bg-[#141414] text-white font-bold rounded-2xl hover:bg-neutral-800 transition shadow-lg"
                >
                  Back to Payments
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
