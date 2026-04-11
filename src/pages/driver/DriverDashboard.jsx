import React from 'react';

const DriverDashboard = ({
  profileImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Uzozyg_eCMorbhLRnbEAos0EgecGGKS_PgyYG23F551US2rKvdbT9hjlQeGeaVnRXWnyyvDxIpSIYmrWRwS5loPwd2wTNY9bcyjGw0Wv0wj5twb8ILZbYZBdeCB_keKcACN-qQQXPwci2hjvd395gywucEpVs_t0s1IfYRYEIspm8xdVGAQt1Gs-8hxcLtn0pPIiHvlQbnIx0r3GMZBRj72eCqaplWvrtoBE2F2Oah9aX6yEsBQIKrxDGiqEB38qFrwQYj-vJv7R",
  isOnline = true,
  weeklyEarnings = "1,284.50",
  earningsGrowth = "+12% vs LW",
  earningsData = [
    { day: 'MON', height: '40%', active: false },
    { day: 'TUE', height: '65%', active: false },
    { day: 'WED', height: '90%', active: true },
    { day: 'THU', height: '55%', active: false },
    { day: 'FRI', height: '75%', active: false },
    { day: 'SAT', height: '30%', active: false },
    { day: 'SUN', height: '20%', active: false },
  ],
  mapImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDSIZqE61Z3Zin4W7o4ff-yCCHyYENOTVTgadgSiTK0qK3ZYV-OwkP7-x8LDq8bzL_HDMcBs8b4QmhF0ftBNzCtBnJHg-IsdN-7xEN2ZL9KIKfSnEvtI-ABFg2fiUZmbUhDQ0m0OT14t0-x4bZCwVUM2nf5AWs2W31bO3D3uv8e4rd8ewj8Tz8spBDc-77CUj-RhzTSMIyF3PHrGnKWfk1PqItPN6Y-xAGo4YtbZDcTjhYHGkBrcsada-k-Zd584MsPS_acfoMHbm5p",
  activeZone = "Downtown SF",
  rating = "4.98",
  totalTrips = "142",
  recentActivity = [
    {
      id: 1,
      icon: 'local_taxi',
      title: 'Airport Premium Express',
      subtitle: 'Completed • 14:20 PM',
      amount: '+$42.50',
      meta: 'Tip Included',
      metaColor: 'text-green-600',
    },
    {
      id: 2,
      icon: 'speed',
      title: 'Rush Hour Boost',
      subtitle: 'Promotion • 12:45 PM',
      amount: '+$8.00',
      meta: 'Multiplier x1.4',
      metaColor: 'text-neutral-500',
    },
    {
      id: 3,
      icon: 'person_pin_circle',
      title: 'City Center Drop-off',
      subtitle: 'Completed • 11:15 AM',
      amount: '+$18.25',
      meta: '8.2 miles',
      metaColor: 'text-neutral-500',
    },
  ],
  navItems = [
    { icon: 'navigation', label: 'Map', active: true, fill: true },
    { icon: 'payments', label: 'Earnings', active: false },
    { icon: 'history', label: 'History', active: false },
    { icon: 'settings', label: 'Settings', active: false },
  ],
  onToggleOnline,
  onLocation,
  onViewAllActivity,
  onSOS,
}) => {
  return (
    <div className="bg-neutral-50 text-[#141414] font-body min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm h-16">
        <div className="flex justify-between items-center px-6 py-4 w-full h-full relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-neutral-200">
              <img
                alt="Driver Profile Photo"
                className="w-full h-full object-cover"
                src={profileImage}
              />
            </div>
            <h1 className="plusJakartaSans font-bold text-lg tracking-tight text-[#1D3557]">
              Navigator
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleOnline}
              className={`text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 active:scale-95 transition-transform duration-150 ${isOnline ? 'bg-green-500' : 'bg-neutral-500'}`}>
              {isOnline && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-28 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Earnings Summary (Large) */}
          <section className="md:col-span-8 bg-white rounded-[2rem] p-8 shadow-sm flex flex-col justify-between overflow-hidden relative border border-neutral-100">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-neutral-500 font-medium text-sm">Weekly Earnings</p>
                  <h2 className="plusJakartaSans text-4xl font-extrabold text-[#1D3557] tracking-tighter mt-1">${weeklyEarnings}</h2>
                </div>
                <div className="bg-[#1D3557] text-white px-3 py-1 rounded-lg text-xs font-bold">
                  {earningsGrowth}
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-32 mt-4">
                {earningsData.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        item.active ? 'bg-[#D9483E]' : 'bg-neutral-200'
                      }`}
                      style={{ height: item.height }}
                    ></div>
                    <span
                      className={`text-[10px] font-bold ${
                        item.active ? 'text-[#D9483E]' : 'text-neutral-500'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Status & Map HUD (Small) */}
          <section className="md:col-span-4 space-y-6">
            {/* Map Fragment */}
            <div className="bg-white rounded-[2rem] h-64 overflow-hidden relative shadow-sm border border-neutral-100 group">
              <img
                alt="Current Location Map"
                className="w-full h-full object-cover opacity-80"
                src={mapImage}
              />
              {/* HUD Overlays */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                  onClick={onLocation}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1D3557] shadow-lg">
                  <span className="material-symbols-outlined" data-icon="my_location">
                    my_location
                  </span>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between text-[#1D3557] border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#D9483E]" data-icon="share_location">
                    share_location
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#141414]">Active Zone</span>
                </div>
                <span className="text-xs font-semibold">{activeZone}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#1D3557] text-white rounded-[2rem] p-6 flex items-center justify-between shadow-sm border border-[#11233e]">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className="material-symbols-outlined text-yellow-500 text-sm"
                    data-icon="star"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="plusJakartaSans text-xl font-bold">{rating}</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-blue-800/50"></div>
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Trips</p>
                <p className="plusJakartaSans text-xl font-bold mt-1">{totalTrips}</p>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="md:col-span-12 bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="plusJakartaSans text-xl font-bold text-[#1D3557]">Recent Activity</h3>
              <button onClick={onViewAllActivity} className="text-[#D9483E] font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-2xl transition-colors border border-neutral-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-neutral-200 shadow-sm rounded-xl flex items-center justify-center text-[#1D3557]">
                      <span className="material-symbols-outlined" data-icon={activity.icon}>
                        {activity.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-[#141414]">{activity.title}</p>
                      <p className="text-xs text-neutral-500">{activity.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[#1D3557]">{activity.amount}</p>
                    <p className={`text-[10px] font-bold uppercase ${activity.metaColor}`}>{activity.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* SOS FAB */}
      <button 
        onClick={onSOS}
        className="fixed right-6 bottom-28 w-14 h-14 rounded-full bg-[#D9483E] text-white shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform">
        <span
          className="material-symbols-outlined"
          data-icon="sos"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          sos
        </span>
      </button>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(3,22,54,0.06)] border-t border-neutral-100 flex justify-around items-center px-4 pb-6 pt-3">
        {navItems.map((nav) => (
          <a
            key={nav.label}
            className={`flex flex-col items-center justify-center px-5 py-2 active:scale-90 transition-all ${
              nav.active
                ? 'text-[#1D3557]'
                : 'text-neutral-400 hover:text-[#1D3557]'
            }`}
            href="#"
          >
            <span
              className="material-symbols-outlined text-2xl"
              data-icon={nav.icon}
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

export default DriverDashboard;
