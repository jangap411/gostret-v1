import React from 'react';

const ProfileEarnings = ({
  driverName = "Marcus Chen",
  profileImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAcyFZMHjBHrf_ZO-rM6lzJYypBZKh_7XL3WBKDgYHNcQOCP8lVyfHWiHMSVNNgAthu7on4Zs5CaXlnHNrBLeMXADcKXK6h7ahhk6gszVjfIQJ6RA2Ufj65a4efj2477ckDXfMVjnOtwSZnWIa17zHCznLsUD5fbx5E2AaTwUGc4DCHeNc4VHouRxa_6XP8lMXG4Tv_9PrebfmcS7Lx38rRw-FxIV8guTWXAzxJM3l6tXw0CSm9NwfmfjDSqq1XvM85oq-_RS4XPwGS",
  sinceYear = "2021",
  rating = "4.98",
  totalTrips = "2,842",
  yearsActive = "3.5",
  weeklyEarnings = "1,248.50",
  dateRange = "Oct 23 - Oct 29",
  earningsData = [
    { day: 'MON', height: '60%', isToday: false },
    { day: 'TUE', height: '45%', isToday: false },
    { day: 'WED', height: '85%', isToday: false },
    { day: 'THU', height: '70%', isToday: false },
    { day: 'FRI', height: '100%', isToday: true, colorClass: 'bg-on-tertiary-container' },
    { day: 'SAT', height: '40%', isToday: false },
    { day: 'SUN', height: '25%', isToday: false },
  ],
  quickActions = [
    { icon: 'description', title: 'Vehicle Documents', subtitle: 'Insurance, Registration, Permits' },
    { icon: 'support_agent', title: 'Help & Support', subtitle: '24/7 Priority driver assistance' },
    { icon: 'security', title: 'Safety Center', subtitle: 'Emergency tools & training' },
  ],
  navItems = [
    { icon: 'navigation', label: 'Map', active: false },
    { icon: 'payments', label: 'Earnings', active: false },
    { icon: 'history', label: 'History', active: false },
    { icon: 'person', label: 'Settings', active: true, fill: true },
  ],
  onSignOut,
  onCashOut,
}) => {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-container min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
              <img
                className="w-full h-full object-cover"
                src={profileImage}
                alt={`${driverName} profile`}
              />
            </div>
            <h1 className="plusJakartaSans font-bold text-lg tracking-tight text-blue-900 dark:text-blue-100">
              Navigator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-blue-900 dark:text-blue-100 font-bold text-xs tracking-widest uppercase">
              ONLINE
            </span>
          </div>
        </div>
        <div className="bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full absolute bottom-0"></div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        {/* Profile Bento Section */}
        <section className="grid grid-cols-2 gap-4">
          {/* Main Profile Card */}
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_24px_rgba(3,22,54,0.04)] flex items-center justify-between">
            <div>
              <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">{driverName}</h2>
              <p className="text-on-surface-variant font-medium mt-1">Professional Partner since {sinceYear}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-on-tertiary-container gap-1">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-headline font-bold text-2xl">{rating}</span>
              </div>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Top Rated</p>
            </div>
          </div>
          {/* Stats Sub-cards */}
          <div className="bg-surface-container-low p-5 rounded-3xl">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">Total Trips</p>
            <p className="font-headline font-extrabold text-2xl text-primary">{totalTrips}</p>
          </div>
          <div className="bg-surface-container-low p-5 rounded-3xl">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">Years Active</p>
            <p className="font-headline font-extrabold text-2xl text-primary">{yearsActive}</p>
          </div>
        </section>

        {/* Earnings Breakdown Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="font-headline font-bold text-xl text-primary">Weekly Earnings</h3>
              <p className="text-on-surface-variant text-sm">{dateRange}</p>
            </div>
            <div className="text-right">
              <p className="font-headline font-extrabold text-3xl text-primary">${weeklyEarnings}</p>
            </div>
          </div>
          {/* Earnings Visualizer (Bento Bars) */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-end justify-between h-32 gap-2 px-2">
              {earningsData.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-secondary-container/30 rounded-t-lg relative group h-full">
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg ${
                        item.colorClass ? item.colorClass : 'bg-primary'
                      }`}
                      style={{ height: item.height }}
                    ></div>
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      item.isToday ? 'text-on-tertiary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            {/* Cash Out Button */}
            <button 
              onClick={onCashOut}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-2xl font-headline font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">account_balance_wallet</span>
              Cash Out Now
            </button>
          </div>
        </section>

        {/* Quick Actions List */}
        <section className="space-y-3">
          <h4 className="px-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest">Management</h4>
          <div className="bg-surface-container-low rounded-3xl overflow-hidden">
            {quickActions.map((action, i, arr) => (
              <React.Fragment key={action.title}>
                <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors text-left group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{action.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-primary">{action.title}</p>
                      <p className="text-sm text-on-surface-variant">{action.subtitle}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </button>
                {i < arr.length - 1 && <div className="mx-5 h-[1px] bg-outline-variant/20"></div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Log Out */}
        <button 
          onClick={onSignOut}
          className="w-full py-4 text-on-tertiary-container font-headline font-bold tracking-tight active:scale-95 transition-transform">
          Sign Out of Account
        </button>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-slate-50 dark:bg-slate-950 rounded-t-3xl shadow-[0_-4px_24px_rgba(3,22,54,0.06)]">
        {navItems.map((nav) => (
          <a
            key={nav.label}
            className={`flex flex-col items-center justify-center px-5 py-2 active:scale-90 transition-all ${
              nav.active
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-2xl'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300'
            }`}
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={nav.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {nav.icon}
            </span>
            <span className="plusJakartaSans font-semibold text-[11px] mt-1">{nav.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default ProfileEarnings;
