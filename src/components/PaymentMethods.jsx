import BottomNav from './BottomNav';
import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function PaymentMethods() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="relative flex size-full min-h-screen flex-col bg-neutral-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between">
          <button className="text-[#141414] flex size-12 shrink-0 items-center cursor-pointer hover:bg-neutral-200 rounded-full justify-center transition" data-icon="ArrowLeft" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Payment methods</h2>
        </div>
        <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Credit and debit cards</h3>
        
        {/* Visa */}
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 justify-between hover:bg-neutral-200 cursor-pointer transition">
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 bg-blue-100 rounded flex items-center justify-center text-[10px] font-bold text-blue-800" style={{ backgroundImage: 'url("/visa.svg")' }}>
              VISA
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">Credit</p>
              <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">Visa ... 4567</p>
            </div>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Mastercard */}
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 justify-between hover:bg-neutral-200 cursor-pointer transition">
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 bg-orange-100 rounded flex items-center justify-center text-[10px] font-bold text-orange-600" style={{ backgroundImage: 'url("/mastercard.svg")' }}>
              MC
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">Credit</p>
              <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">Mastercard ... 1234</p>
            </div>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Add Payment Method */}
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-14 justify-between hover:bg-neutral-200 cursor-pointer transition">
          <div className="flex items-center gap-4">
            <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-10" data-icon="Plus" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
              </svg>
            </div>
            <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">Add payment method</p>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </div>

        <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Digital wallets</h3>
        
        {/* Paypal */}
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-14 justify-between hover:bg-neutral-200 cursor-pointer transition">
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 bg-blue-50 rounded flex items-center justify-center text-[#141414]" style={{ backgroundImage: 'url("/paypal.svg")' }}>Pay</div>
            <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">Paypal</p>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Venmo */}
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-14 justify-between hover:bg-neutral-200 cursor-pointer transition">
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 bg-cyan-100 rounded flex items-center justify-center text-[#141414]" style={{ backgroundImage: 'url("/venmo.svg")' }}>V</div>
            <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">Venmo</p>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Apple Pay */}
        <div className="flex items-center gap-4 bg-neutral-50 px-4 min-h-14 justify-between hover:bg-neutral-200 cursor-pointer transition">
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 bg-neutral-200 rounded flex items-center justify-center text-[#141414]" style={{ backgroundImage: 'url("/applepay.svg")' }}>Ap</div>
            <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">Apple Pay</p>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </motion.div>
  );
}
