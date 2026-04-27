import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { socketService } from '../../services/socket';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  LayoutDashboard, 
  Radio, 
  Map as MapIcon, 
  Car, 
  Users, 
  Star, 
  RefreshCcw, 
  Bell, 
  Search, 
  Shield, 
  X, 
  AlertTriangle,
  ChevronRight,
  Wallet,
  Clock,
  ArrowUpRight,
  TrendingUp,
  LogOut,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const makeAvatarMarker = (imageUrl, name, color = '#22c55e') => new L.DivIcon({
  html: imageUrl
    ? `<div style="width:44px;height:44px;border-radius:12px;border:3px solid ${color};background:#020617;overflow:hidden;box-shadow:0 0 15px ${color}44;position:relative">
         <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'" />
       </div>
       <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ${color}"></div>`
    : `<div style="width:40px;height:40px;border-radius:12px;background:${color};border:3px solid #0f172a;box-shadow:0 0 15px ${color}44;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:14px;font-family:'Fira Code'">${(name||'?')[0].toUpperCase()}</div>`,
  className: '',
  iconSize: [44, 54],
  iconAnchor: [22, 54],
  popupAnchor: [0, -56],
});

const makeSOSMarker = () => new L.DivIcon({
  html: `<div class="sos-marker">
          <div class="sos-ping"></div>
          <div class="sos-inner">🚨</div>
        </div>`,
  className: '',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

const STATUS_CONFIG = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  accepted: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  in_progress: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  completed: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  cancelled: { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

const StatCard = ({ label, value, sub, icon: Icon, color = 'emerald' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-400`}>
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
          <Icon size={18} />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight text-white font-heading">{value}</p>
        {sub && <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp size={10} /> {sub}</span>}
      </div>
    </div>
  </motion.div>
);

const Avatar = ({ src, name, size = 10 }) => (
  <div className={`w-${size} h-${size} rounded-xl overflow-hidden bg-slate-800 border border-white/5 shrink-0 flex items-center justify-center`}>
    {src ? (
      <img src={src} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-xs font-bold text-slate-400 uppercase font-heading">{(name || '?')[0]}</span>
    )}
  </div>
);

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [liveRides, setLiveRides] = useState([]);
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rideFilter, setRideFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [mapLayer, setMapLayer] = useState('standard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [sosAlerts, setSosAlerts] = useState([]);

  const token = localStorage.getItem('token');

  const fetchAll = useCallback(async () => {
    if (!token) { setError('Not authenticated'); setLoading(false); return; }
    const start = Date.now();
    try {
      setLoading(true);
      const [s, t, lr, r, u, rv, tx] = await Promise.all([
        adminService.getStats(token),
        adminService.getTrend(token),
        adminService.getLiveRides(token),
        adminService.getRides(token, { status: rideFilter, limit: 30 }),
        adminService.getUsers(token, { role: userFilter, limit: 30 }),
        adminService.getReviews(token, { limit: 20 }),
        adminService.getTransactions(token, { limit: 30 }),
      ]);
      const latency = Date.now() - start;
      setStats({ ...s, latency }); 
      setTrend(t); 
      setLiveRides(lr); 
      setRides(r.rides || []); 
      setUsers(u.users || []); 
      setReviews(rv.reviews || []); 
      setTransactions(tx.transactions || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [token, rideFilter, userFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const iv = setInterval(async () => {
      if (!token) return;
      try { setLiveRides(await adminService.getLiveRides(token)); } catch (_) {}
    }, 10000);
    return () => clearInterval(iv);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    socketService.joinAdmin();
    socketService.onSOSAlert((data) => {
      setSosAlerts(prev => [data, ...prev]);
      setTab('map');
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch (err) {}
    });
    return () => { socketService.off('sos_alert'); };
  }, [token]);

  const dismissSOS = (timestamp) => {
    setSosAlerts(prev => prev.filter(s => s.timestamp !== timestamp));
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this ride?')) return;
    setCancellingId(id);
    try {
      await adminService.cancelRide(token, id);
      setLiveRides(p => p.filter(r => r.id !== id));
      setRides(p => p.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    } catch (e) { alert(e.message); }
    finally { setCancellingId(null); }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Activity', icon: Radio, badge: liveRides.length },
    { id: 'map', label: 'Safety Map', icon: MapIcon },
    { id: 'financials', label: 'Financials', icon: Wallet },
    { id: 'rides', label: 'Ride History', icon: Car },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'reviews', label: 'Safety Reviews', icon: Star },
  ];

  const TrendChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.total_rides), 1);
    return (
      <div className="flex items-end justify-between h-32 gap-2 px-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full relative">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(d.total_rides / maxVal) * 100}%` }}
                className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-lg relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap z-20">
                  {d.total_rides} Rides
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-emerald-500 h-1 rounded-full shadow-glow" />
              </motion.div>
            </div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
              {new Date(d.date).toLocaleDateString('en-GB', { weekday: 'short' })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (error) return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-10 max-w-md w-full text-center"
      >
        <div className="size-20 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield size={40} />
        </div>
        <h2 className="text-white text-2xl font-bold mb-3 font-heading">Access Restricted</h2>
        <p className="text-slate-400 text-sm mb-8">{error}</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="w-full primary-gradient text-white font-bold py-4 rounded-xl shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Return to Security
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen animated-gradient text-slate-200 flex flex-col md:flex-row font-body">
      <style>{`
        .sos-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sos-ping {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ef4444;
          opacity: 0.5;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .sos-inner {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #ef4444;
          border: 4px solid #fff;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          position: relative;
          z-index: 10;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .leaflet-container {
          background: #020617 !important;
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 glass-nav md:border-r border-white/5 md:h-screen sticky top-0 z-50 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 primary-gradient rounded-xl flex items-center justify-center shadow-glow">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-none font-heading">GoStret</h1>
              <p className="text-emerald-400 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Admin Ops</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  tab === item.id 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={tab === item.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 mt-auto space-y-6">
          <div className="glass-card rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet Status</span>
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-glow" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Dispatch Units</span>
                <span className="text-xs font-bold text-white">{stats?.totalDrivers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">System Latency</span>
                <span className="text-xs font-bold text-emerald-400">{stats?.latency || 12}ms</span>
              </div>
            </div>
          </div>
          
          <button className="flex items-center gap-3 text-slate-500 hover:text-rose-400 transition-colors w-full p-2 group">
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">System Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto h-screen custom-scrollbar">
        {/* Header Row */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <motion.div 
              key={tab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-white font-heading tracking-tight capitalize">
                {tab.replace('-', ' ')}
              </h2>
              <p className="text-slate-400 text-sm mt-1">Operational command center & system monitoring</p>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Global System Search..." 
                className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 w-64 transition-all"
              />
            </div>
            <button onClick={fetchAll} className={`p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all ${loading ? 'animate-spin' : ''}`}>
              <RefreshCcw size={20} />
            </button>
            <div className="relative">
              <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all">
                <Bell size={20} />
              </button>
              <span className="absolute -top-1 -right-1 size-4 bg-emerald-500 border-2 border-base rounded-full" />
            </div>
          </div>
        </header>

        {/* SOS ALERTS ANNER */}
        <AnimatePresence>
          {sosAlerts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 space-y-4"
            >
              {sosAlerts.map(sos => (
                <div key={sos.timestamp} className="bg-rose-600/90 backdrop-blur-xl border border-rose-500/50 text-white rounded-3xl p-6 shadow-2xl flex items-start gap-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-rose-500 animate-pulse opacity-20" />
                  <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <AlertTriangle size={32} className="animate-bounce" />
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold font-heading">CRITICAL SOS ALERT</h3>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Immediate Response Required</span>
                    </div>
                    <p className="font-bold text-lg opacity-90">{sos.userName} <span className="text-sm font-normal opacity-70">({sos.userRole})</span></p>
                    <div className="flex gap-4 mt-3 text-sm font-medium opacity-80">
                      <div className="flex items-center gap-1.5"><MapIcon size={14} /> {sos.lat?.toFixed(5)}, {sos.lng?.toFixed(5)}</div>
                      <div className="flex items-center gap-1.5"><Clock size={14} /> {new Date(sos.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <button 
                      onClick={() => setTab('map')}
                      className="bg-white text-rose-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-slate-100 transition-colors"
                    >
                      Track on Map
                    </button>
                    <button 
                      onClick={() => dismissSOS(sos.timestamp)}
                      className="bg-black/20 hover:bg-black/40 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !stats && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="size-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing System Data...</p>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {tab === 'overview' && stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Live Revenue" value={`PGK ${stats.todayRevenue?.toFixed(2)}`} sub="+12.5%" icon={Wallet} color="emerald" />
              <StatCard label="Today's Missions" value={stats.todayRides} sub="+4.2%" icon={Car} color="blue" />
              <StatCard label="Active Personnel" value={stats.onlineDrivers} sub="Online" icon={Users} color="amber" />
              <StatCard label="Safety Score" value="98.2%" sub="High" icon={Shield} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Trend Chart Card */}
                <div className="glass-card rounded-3xl p-8 overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-white font-heading">Mission Velocity</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Last 7 Cycles</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded text-[10px] font-bold text-emerald-400">
                        <TrendingUp size={12} /> +14%
                      </div>
                    </div>
                  </div>
                  <TrendChart data={trend} />
                </div>

                {/* Live Activity Feed */}
                <div className="glass-card rounded-3xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white font-heading">Real-Time Operations</h3>
                    <button onClick={() => setTab('live')} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group">
                      Command View <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {liveRides.length > 0 ? (
                      liveRides.slice(0, 6).map(r => (
                        <div key={r.id} className="px-8 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                          <Avatar src={r.rider_avatar} name={r.rider_name} size={10} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-white truncate">{r.rider_name}</p>
                              <ChevronRight size={12} className="text-slate-600" />
                              <p className="text-sm text-slate-400 truncate">{r.driver_name || 'Dispatching...'}</p>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{r.pickup_address}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${STATUS_CONFIG[r.status]?.bg} ${STATUS_CONFIG[r.status]?.color}`}>
                              {r.status.replace('_', ' ')}
                            </span>
                            <p className="text-xs font-bold text-white">PGK {r.fare}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <p className="text-slate-500 text-sm italic">No active missions in progress</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* System Health / Right Sidebar */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Radio size={14} className="text-emerald-500" /> System Health
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Database Cluster</span>
                      <span className="text-xs font-bold text-emerald-400">Stable</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1">
                      <div className="bg-emerald-500 h-full w-[94%] rounded-full shadow-glow" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Socket Latency</span>
                      <span className="text-xs font-bold text-emerald-400">{stats.latency || 12}ms</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1">
                      <div className="bg-emerald-500 h-full w-[98%] rounded-full shadow-glow" />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Shield size={100} />
                  </div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Total Assets</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-white font-heading">{stats.totalRiders}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Riders</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white font-heading">{stats.totalDrivers}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Drivers</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Total Yield</p>
                    <p className="text-2xl font-bold text-emerald-400 font-heading">PGK {stats.totalRevenue?.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FINANCIALS TAB */}
        {tab === 'financials' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-3xl p-6 border-l-4 border-emerald-500">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white font-heading">PGK {stats?.totalRevenue?.toFixed(2)}</p>
              </div>
              <div className="glass-card rounded-3xl p-6 border-l-4 border-blue-500">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg Transaction</p>
                <p className="text-3xl font-bold text-white font-heading">PGK {stats?.avgFare?.toFixed(2)}</p>
              </div>
              <div className="glass-card rounded-3xl p-6 border-l-4 border-amber-500">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Wallet Pool</p>
                <p className="text-3xl font-bold text-white font-heading">PGK {users.reduce((acc, u) => acc + (parseFloat(u.wallet_balance) || 0), 0).toFixed(0)}</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5">
                <h3 className="font-bold text-white font-heading">Transaction Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      {['User Unit','Type','Amount','Status','Reference','Timestamp'].map(h => (
                        <th key={h} className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white uppercase">{(tx.user_name || '?')[0]}</div>
                            <div>
                              <p className="text-sm font-bold text-white">{tx.user_name}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{tx.user_role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{tx.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.type === 'credit' ? '+' : '-'} PGK {tx.amount}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase tracking-widest">Successful</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">TX-{tx.id.slice(0,8)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{new Date(tx.created_at).toLocaleTimeString()}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* LIVE TAB */}
        {tab === 'live' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                <h3 className="font-bold text-white font-heading">Active Operations Feed</h3>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Refreshes in 10s</span>
            </div>
            
            {liveRides.length === 0 ? (
              <div className="glass-card rounded-3xl py-32 text-center">
                <div className="size-20 bg-white/5 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Radio size={40} />
                </div>
                <p className="text-slate-400 font-bold">Awaiting mission requests...</p>
                <p className="text-xs text-slate-600 mt-2">Active rides will broadcast here in real-time</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {liveRides.map(r => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={r.id} 
                    className="glass-card rounded-3xl p-6 space-y-6 border border-white/5 hover:border-emerald-500/20 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`size-12 rounded-2xl flex items-center justify-center ${STATUS_CONFIG[r.status]?.bg} ${STATUS_CONFIG[r.status]?.color} border ${STATUS_CONFIG[r.status]?.border}`}>
                          <Car size={24} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${STATUS_CONFIG[r.status]?.color}`}>{r.status.replace('_', ' ')}</p>
                          <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: #{r.id} · PGK {r.fare}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 group"
                      >
                        <X size={14} className="group-hover:rotate-90 transition-transform" /> {cancellingId === r.id ? 'TERMINATING...' : 'ABORT'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Rider Intelligence</p>
                        <div className="flex items-center gap-3">
                          <Avatar src={r.rider_avatar} name={r.rider_name} size={10} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate leading-none">{r.rider_name || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500 mt-1 truncate">{r.rider_email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Unit Assigned</p>
                        {r.driver_name ? (
                          <div className="flex items-center gap-3">
                            <Avatar src={r.driver_avatar} name={r.driver_name} size={10} />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate leading-none">{r.driver_name}</p>
                              <p className="text-[10px] text-slate-500 mt-1 truncate">{r.car_plate}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-10 flex items-center">
                            <p className="text-[11px] text-amber-400 font-bold italic animate-pulse">Dispatching Unit...</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 relative before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-white/10">
                      <div className="flex gap-4 relative z-10">
                        <div className="size-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="size-1.5 bg-emerald-500 rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Origin</p>
                          <p className="text-xs text-white truncate mt-0.5">{r.pickup_address}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 relative z-10">
                        <div className="size-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="size-1.5 bg-blue-500 rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Objective</p>
                          <p className="text-xs text-white truncate mt-0.5">{r.destination_address}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* MAP TAB */}
        {tab === 'map' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-white font-heading">Geospatial Intelligence</h3>
                <p className="text-xs text-slate-500 mt-1">Live tactical view of all active personnel and assets</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">SOS Alerts</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[500px] glass-card rounded-3xl overflow-hidden relative border border-white/10">
              <MapContainer
                center={[liveRides[0]?.pickup_lat ?? -9.44, liveRides[0]?.pickup_lng ?? 147.18]}
                zoom={13}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution={mapLayer === 'standard' 
                    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    : '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}
                  url={mapLayer === 'standard'
                    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
                />
                
                {/* SOS Markers */}
                {sosAlerts.map(sos => (
                  sos.lat && sos.lng && (
                    <Marker 
                      key={`sos-${sos.timestamp}`} 
                      position={[sos.lat, sos.lng]} 
                      icon={makeSOSMarker()}
                      zIndexOffset={1000}
                    >
                      <Popup>
                        <div className="text-center p-2">
                          <p className="font-black text-rose-500 text-sm mb-1 font-heading uppercase tracking-widest">CRITICAL SOS</p>
                          <p className="font-bold text-white text-base">{sos.userName}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{sos.userRole} Unit</p>
                          <button className="w-full primary-gradient text-white text-[10px] font-black mt-3 py-2 rounded-lg uppercase tracking-widest">Dispatch Unit</button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}

                {/* Ride Markers */}
                {liveRides.map(r => (
                  <Marker
                    key={r.id}
                    position={[r.pickup_lat, r.pickup_lng]}
                    icon={makeAvatarMarker(r.rider_avatar, r.rider_name, r.status === 'accepted' ? '#3b82f6' : '#22c55e')}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                          <Avatar src={r.rider_avatar} name={r.rider_name} size={10} />
                          <div>
                            <p className="font-bold text-white text-sm">{r.rider_name}</p>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${STATUS_CONFIG[r.status]?.bg} ${STATUS_CONFIG[r.status]?.color}`}>
                              {r.status}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-[10px] leading-tight text-slate-300"><span className="text-slate-500 font-bold uppercase tracking-widest mr-1">Origin:</span> {r.pickup_address}</p>
                          <p className="text-[10px] leading-tight text-slate-300"><span className="text-slate-500 font-bold uppercase tracking-widest mr-1">Dest:</span> {r.destination_address}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <p className="text-xs font-bold text-white">PGK {r.fare}</p>
                          {r.driver_name && <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{r.car_plate}</p>}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map Floating HUD */}
              <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
                <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="size-2.5 bg-emerald-500 rounded-full" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{liveRides.length} Active Missions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-2.5 bg-rose-500 rounded-full" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sosAlerts.length} Active Alerts</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setMapLayer(prev => prev === 'standard' ? 'satellite' : 'standard')}
                    className="glass-card size-12 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-2xl border border-white/10 group relative"
                  >
                    <Layers size={18} />
                    <span className="absolute right-14 bg-slate-800 text-[10px] font-bold px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {mapLayer === 'standard' ? 'Switch to Satellite' : 'Switch to Standard'}
                    </span>
                  </button>
                  <button 
                    onClick={() => fetchAll()}
                    className="glass-card size-12 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-2xl border border-white/10"
                  >
                    <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* RIDES TAB */}
        {tab === 'rides' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-white font-heading">Archived Missions</h3>
                <p className="text-xs text-slate-500 mt-1">Complete historical record of all fleet activity</p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-xl border border-white/5">
                {['all','completed','cancelled','pending'].map(s => (
                  <button key={s} onClick={() => setRideFilter(s)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${rideFilter === s ? 'primary-gradient text-white shadow-glow' : 'text-slate-500 hover:text-slate-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      {['ID','Rider Unit','Field Asset','Outcome','Yield','Timeline'].map(h => (
                        <th key={h} className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rides.map(r => (
                      <tr key={r.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-slate-500">#{r.id.slice(0, 8)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={r.rider_avatar} name={r.rider_name} size={9} />
                            <div>
                              <p className="text-sm font-bold text-white">{r.rider_name}</p>
                              <p className="text-[10px] text-slate-500">{r.rider_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {r.driver_name ? (
                            <div className="flex items-center gap-3">
                              <Avatar src={r.driver_avatar} name={r.driver_name} size={9} />
                              <div>
                                <p className="text-sm font-bold text-white">{r.driver_name}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{r.car_plate}</p>
                              </div>
                            </div>
                          ) : <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Unassigned</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${STATUS_CONFIG[r.status]?.bg} ${STATUS_CONFIG[r.status]?.color}`}>
                            {r.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white font-heading">PGK {r.fare}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rides.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No matching archives found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-white font-heading">Global Directory</h3>
                <p className="text-xs text-slate-500 mt-1">Verified riders and service providers</p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-xl border border-white/5">
                {['all','rider','driver','admin'].map(r => (
                  <button key={r} onClick={() => setUserFilter(r)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${userFilter === r ? 'primary-gradient text-white shadow-glow' : 'text-slate-500 hover:text-slate-200'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map(u => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={u.id} 
                  className="glass-card rounded-3xl p-6 flex flex-col gap-5 group hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar src={u.avatar_url} name={u.name} size={14} />
                      {u.is_online && (
                        <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      )}
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-rose-500/10 text-rose-400' :
                      u.role === 'driver' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  
                  <div className="min-w-0">
                    <h4 className="text-lg font-bold text-white font-heading truncate leading-tight">{u.name}</h4>
                    <p className="text-xs text-slate-500 truncate mt-1">{u.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Yield</p>
                      <p className="text-sm font-bold text-white font-heading">PGK {u.wallet_balance}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <p className="text-sm font-bold text-white">{parseFloat(u.average_rating || 5).toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  {u.car_model && (
                    <div className="mt-auto bg-white/5 rounded-2xl p-3 flex items-center gap-3">
                      <Car size={16} className="text-slate-500" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-white font-bold truncate leading-none">{u.car_model}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{u.car_plate}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {users.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500 font-bold uppercase tracking-widest">No users indexed</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* REVIEWS TAB */}
        {tab === 'reviews' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-bold text-white font-heading">Safety Review Matrix</h3>
              <p className="text-xs text-slate-500 mt-1">Surveillance feedback and incident reporting</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map(rv => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={rv.id} 
                  className={`glass-card rounded-3xl p-6 space-y-5 border-l-4 ${rv.rating <= 2 ? 'border-rose-500 bg-rose-500/5' : 'border-emerald-500 bg-emerald-500/5'}`}
                >
                  {rv.rating <= 2 && (
                    <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                      <AlertTriangle size={14} /> Critical Feedback — Review Pending
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={rv.reviewer_avatar} name={rv.reviewer_name} size={10} />
                      <div>
                        <p className="font-bold text-sm text-white leading-tight">{rv.reviewer_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">on {rv.reviewee_name}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} className={rv.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-800'} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{rv.comment || 'No comment provided'}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Incident Logged</span>
                    <span className="text-[10px] text-slate-500 font-medium">{new Date(rv.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </motion.div>
              ))}
              {reviews.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500 font-bold uppercase tracking-widest">No reports in buffer</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
