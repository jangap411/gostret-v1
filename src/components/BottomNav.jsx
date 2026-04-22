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
      icon: 'home',
      material: true
    },
    { 
      name: 'Rides', 
      path: '/ride-in-progress', 
      icon: 'directions_car',
      material: true
    },
    { 
      name: 'Wallet', 
      path: '/payment-methods', 
      icon: 'account_balance_wallet',
      material: true
    },
    { 
      name: 'Activity', 
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

  const driverTabs = [
    { 
      name: 'Map', 
      path: '/', 
      icon: 'map',
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
    <div className="glass-surface px-4 pb-6 pt-3 relative z-50 pointer-events-auto flex justify-around items-center border-t border-white/20">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90 ${
              isActive 
                ? (isDriver ? 'text-success' : 'text-primary') 
                : 'text-slate-400 hover:text-primary'
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center transition-transform ${isActive ? 'scale-110' : ''}`}>
              <span 
                className="material-symbols-outlined text-[24px]" 
                style={{ 
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.icon}
              </span>
            </div>
            <p className={`text-[10px] font-bold tracking-tight transition-colors ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.name}
            </p>
            {isActive && (
              <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isDriver ? 'bg-success' : 'bg-primary'}`} />
            )}
          </Link>
        );
      })}
    </div>
  );
}
