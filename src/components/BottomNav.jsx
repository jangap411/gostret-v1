import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isDriver = user.role === 'driver';

  const riderTabs = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
    },
    { 
      name: 'Rides', 
      path: '/ride-in-progress', 
      icon: <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path>
    },
    { 
      name: 'Wallet', 
      path: '/payment-methods', 
      icon: <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,152Z"></path>
    },
    { 
      name: 'Activity', 
      path: '/activity', 
      icon: <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
    },
    { 
      name: 'Account', 
      path: '/account', 
      icon: <path d="M230.92,212-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
    }
  ];

  const driverTabs = [
    { 
      name: 'Map', 
      path: '/', 
      icon: 'navigation',
      material: true
    },
    { 
      name: 'Earnings', 
      path: '/earnings', 
      icon: 'payments',
      material: true
    },
    { 
      name: 'History', 
      path: '/activity', 
      icon: 'history',
      material: true
    },
    { 
      name: 'Account', 
      path: '/account', 
      icon: 'person', 
      material: true
    }
  ];

  const tabs = isDriver ? driverTabs : riderTabs;

  return (
    <div className="flex gap-2 border-t border-neutral-100 bg-white px-4 pb-3 pt-2 relative z-50 pointer-events-auto">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`just flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${
              isActive 
                ? (isDriver ? 'text-[#10B981]' : 'text-[#1D3557]') 
                : 'text-[#637888] hover:text-[#1D3557]'
            }`}
          >
            <div className={`flex h-8 items-center justify-center ${
              isActive 
                ? (isDriver ? 'text-[#10B981]' : 'text-[#1D3557]') 
                : 'text-neutral-400'
            }`}>
              {tab.material ? (
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "''" }}>
                  {tab.icon}
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isActive ? "0" : "12"} viewBox="0 0 256 256">
                  {tab.icon}
                </svg>
              )}
            </div>
            <p className="text-[11px] font-bold leading-normal tracking-wide">{tab.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
