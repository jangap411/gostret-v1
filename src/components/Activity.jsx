import BottomNav from './BottomNav';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
};

const RIDE_HISTORY = [
  {
    id: '1',
    date: 'June 20, 2024',
    month: 'June 2024',
    time: '12:30 PM',
    price: '$12.34',
    distance: '1.2 mi',
    duration: '10 min',
    origin: '7-Mile Airport',
    destination: 'Boroko Foodworld',
    driver: 'John Doe',
    driverRating: '4.8',
    car: 'Toyota Camry - white'
  },
  {
    id: '2',
    date: 'June 15, 2024',
    month: 'June 2024',
    time: '10:00 AM',
    price: '$25.67',
    distance: '3.5 mi',
    duration: '18 min',
    origin: 'Vision City Mega Mall',
    destination: 'Laguna Hotel',
    driver: 'Sarah Smith',
    driverRating: '4.9',
    car: 'Hyundai Tucson - silver'
  },
  {
    id: '3',
    date: 'May 28, 2024',
    month: 'May 2024',
    time: '08:45 PM',
    price: '$18.90',
    distance: '2.8 mi',
    duration: '15 min',
    origin: 'Port Moresby Nature Park',
    destination: 'Waigani Central',
    driver: 'Michael Wong',
    driverRating: '4.7',
    car: 'Kia Sportage - black'
  },
  {
    id: '4',
    date: 'May 10, 2024',
    month: 'May 2024',
    time: '04:00 PM',
    price: '$15.75',
    distance: '1.5 mi',
    duration: '12 min',
    origin: 'Royal Papua Yacht Club',
    destination: 'Harbour City',
    driver: 'Anna Brown',
    driverRating: '5.0',
    car: 'Toyota Passo - red'
  }
];

export default function Activity() {
  const [selectedRide, setSelectedRide] = useState(null);

  const groupedRides = RIDE_HISTORY.reduce((acc, ride) => {
    if (!acc[ride.month]) acc[ride.month] = [];
    acc[ride.month].push(ride);
    return acc;
  }, {});

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
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between sticky top-0 z-50">
          <button 
            onClick={() => selectedRide ? setSelectedRide(null) : window.history.back()}
            className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-neutral-200 transition rounded-full cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            {selectedRide ? 'Trip details' : 'Activity'}
          </h2>
        </div>
        
        <AnimatePresence mode="wait">
          {!selectedRide ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              {Object.keys(groupedRides).map(month => (
                <React.Fragment key={month}>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{month}</h3>
                  {groupedRides[month].map(ride => (
                    <div 
                      key={ride.id} 
                      onClick={() => setSelectedRide(ride)}
                      className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 justify-between hover:bg-neutral-100 cursor-pointer transition active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{ride.price}</p>
                          <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">{ride.time} · {ride.distance}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-neutral-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col px-4 pt-2 pb-10"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden mb-6">
                <div className="h-40 bg-neutral-200 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D9483E_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200 flex items-center gap-2">
                    <div className="size-2 bg-[#D9483E] rounded-full"></div>
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Trip Map View</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-xl font-bold text-[#141414]">{selectedRide.price}</h4>
                      <p className="text-neutral-500 text-sm">{selectedRide.date} · {selectedRide.time}</p>
                    </div>
                    <div className="bg-neutral-100 px-3 py-1 rounded-full">
                       <p className="text-[#141414] text-xs font-bold uppercase">Completed</p>
                    </div>
                  </div>

                  <div className="flex flex-col relative pl-6 gap-6 my-2">
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-neutral-100 flex flex-col items-center">
                       <div className="size-2 -mt-1.5 bg-neutral-800 rounded-full"></div>
                       <div className="size-2 -mb-1.5 mt-auto bg-[#D9483E] rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Pickup</p>
                      <p className="text-[#141414] font-medium">{selectedRide.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Destination</p>
                      <p className="text-[#141414] font-medium">{selectedRide.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Driver</p>
                    <p className="text-[#141414] font-bold text-lg">{selectedRide.driver}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 font-bold">★</span>
                      <span className="text-sm font-bold text-neutral-600">{selectedRide.driverRating}</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                     <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Car</p>
                     <p className="text-[#141414] font-medium">{selectedRide.car}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-[#141414] font-bold text-lg">{selectedRide.distance}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Time</p>
                    <p className="text-[#141414] font-bold text-lg">{selectedRide.duration}</p>
                  </div>
                </div>

                <button 
                  onClick={() => alert("Receipt sent to your email")}
                  className="mt-4 w-full h-14 bg-white border-2 border-neutral-100 text-[#141414] font-bold rounded-2xl hover:bg-neutral-50 transition"
                >
                  View Receipt
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
