import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const makeAvatarMarker = (imageUrl, name, color = '#1e293b') => new L.DivIcon({
  html: imageUrl
    ? `<div style="width:44px;height:44px;border-radius:50%;border:3px solid ${color};background:#fff;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.25);position:relative">
         <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'" />
       </div>
       <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ${color}"></div>`
    : `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:14px">${(name||'?')[0].toUpperCase()}</div>`,
  className: '',
  iconSize: [44, 54],
  iconAnchor: [22, 54],
  popupAnchor: [0, -56],
});

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const StatCard = ({ label, value, sub, color = 'slate' }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100`}>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black tracking-tighter text-${color}-700`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const Avatar = ({ src, name, size = 8 }) => (
  src
    ? <img src={src} alt={name} className={`size-${size} rounded-xl object-cover border-2 border-slate-100`} />
    : <div className={`size-${size} rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-black border-2 border-slate-100`}>{(name || '?')[0].toUpperCase()}</div>
);

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [liveRides, setLiveRides] = useState([]);
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rideFilter, setRideFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchAll = useCallback(async () => {
    if (!token) { setError('Not authenticated'); setLoading(false); return; }
    try {
      setLoading(true);
      const [s, lr, r, u, rv] = await Promise.all([
        adminService.getStats(token),
        adminService.getLiveRides(token),
        adminService.getRides(token, { status: rideFilter, limit: 30 }),
        adminService.getUsers(token, { role: userFilter, limit: 30 }),
        adminService.getReviews(token, { limit: 20 }),
      ]);
      setStats(s); setLiveRides(lr); setRides(r.rides || []); setUsers(u.users || []); setReviews(rv.reviews || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [token, rideFilter, userFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-refresh live rides every 10s
  useEffect(() => {
    const iv = setInterval(async () => {
      if (!token) return;
      try { setLiveRides(await adminService.getLiveRides(token)); } catch (_) {}
    }, 10000);
    return () => clearInterval(iv);
  }, [token]);

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

  const TABS = ['overview', 'live', 'map', 'rides', 'users', 'reviews'];

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-white text-xl font-black mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm">{error}</p>
        <p className="text-slate-500 text-xs mt-2">Admin access required</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="text-lg">🛡️</span>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight leading-none">GoStret Admin</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Safety & Operations Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {liveRides.length > 0 && (
            <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full">
              <span className="size-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs font-bold">{liveRides.length} Live</span>
            </div>
          )}
          <button onClick={fetchAll} className="size-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors" title="Refresh">
            <span className="text-sm">🔄</span>
          </button>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="bg-white border-b border-slate-200 px-6 sticky top-[61px] z-40">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'live' ? `🔴 ${t}` : t === 'map' ? `🗺️ ${t}` : t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && <div className="text-center py-20 text-slate-400 font-bold">Loading data...</div>}

        {/* OVERVIEW TAB */}
        {!loading && tab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Today's Rides" value={stats.todayRides} sub="total today" color="slate" />
              <StatCard label="Today's Revenue" value={`PGK ${stats.todayRevenue?.toFixed(2)}`} sub="completed fares" color="green" />
              <StatCard label="Active Now" value={stats.activeRides} sub="pending/accepted/in-progress" color="blue" />
              <StatCard label="Online Drivers" value={stats.onlineDrivers} sub={`of ${stats.totalDrivers} total`} color="purple" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Rides" value={stats.totalRides} color="slate" />
              <StatCard label="Completed" value={stats.completedRides} color="green" />
              <StatCard label="Cancelled" value={stats.cancelledRides} color="red" />
              <StatCard label="Avg Fare" value={`PGK ${stats.avgFare?.toFixed(2)}`} color="slate" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Riders" value={stats.totalRiders} color="slate" />
              <StatCard label="Total Revenue" value={`PGK ${stats.totalRevenue?.toFixed(2)}`} color="green" />
            </div>

            {/* Live Rides Preview */}
            {liveRides.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900">🔴 Live Rides</h2>
                  <button onClick={() => setTab('live')} className="text-xs font-bold text-slate-500 hover:text-slate-900">View All →</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {liveRides.slice(0, 5).map(r => (
                    <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                      <Avatar src={r.rider_avatar} name={r.rider_name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">{r.rider_name} → {r.driver_name || 'Awaiting driver'}</p>
                        <p className="text-xs text-slate-400 truncate">{r.pickup_address}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      <span className="text-xs font-black text-slate-700">PGK {r.fare}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIVE TAB */}
        {!loading && tab === 'live' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-lg">Active & Accepted Rides</h2>
              <span className="text-sm text-slate-400">Auto-refreshes every 10s</span>
            </div>
            {liveRides.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-bold">No active rides right now</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {liveRides.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status.replace('_', ' ')}</span>
                        <p className="text-xs text-slate-400 mt-1">Ride #{r.id} · PGK {r.fare}</p>
                      </div>
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancellingId === r.id ? 'Cancelling...' : '🚨 Cancel'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rider</p>
                        <div className="flex items-center gap-2">
                          <Avatar src={r.rider_avatar} name={r.rider_name} />
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">{r.rider_name || 'Unknown'}</p>
                            <p className="text-[10px] text-slate-400">{r.rider_email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Driver</p>
                        {r.driver_name ? (
                          <div className="flex items-center gap-2">
                            <Avatar src={r.driver_avatar} name={r.driver_name} />
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-none">{r.driver_name}</p>
                              <p className="text-[10px] text-slate-400">{r.car_model} · {r.car_plate}</p>
                            </div>
                          </div>
                        ) : <p className="text-sm text-slate-400 italic">Awaiting driver</p>}
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex gap-2"><span className="font-bold text-slate-700">📍</span><span className="truncate">{r.pickup_address}</span></div>
                      <div className="flex gap-2"><span className="font-bold text-slate-700">🏁</span><span className="truncate">{r.destination_address}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MAP TAB */}
        {tab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-slate-900 text-lg">Live Ride Map</h2>
                <p className="text-xs text-slate-400 mt-0.5">Pickup locations for all active, accepted &amp; in-progress rides · Auto-refreshes every 10s</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-blue-500 inline-block"></span> Rider pickup</span>
                <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-slate-800 inline-block"></span> Driver</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{liveRides.length} active</span>
              </div>
            </div>

            {liveRides.length === 0 ? (
              <div className="h-[600px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400">
                <div className="text-5xl mb-3">🗺️</div>
                <p className="font-bold">No active rides to display</p>
                <p className="text-xs mt-1">Rides will appear here when accepted or in progress</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: '640px' }}>
                <MapContainer
                  center={[liveRides[0]?.pickup_lat ?? -9.44, liveRides[0]?.pickup_lng ?? 147.18]}
                  zoom={12}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  {liveRides.map(r => (
                    <React.Fragment key={r.id}>
                      {/* Rider pickup marker (blue ring) */}
                      <Marker
                        position={[r.pickup_lat, r.pickup_lng]}
                        icon={makeAvatarMarker(r.rider_avatar, r.rider_name, '#3b82f6')}
                      >
                        <Popup>
                          <div className="text-xs space-y-1 min-w-[180px]">
                            <div className="flex items-center gap-2 mb-2">
                              {r.rider_avatar && <img src={r.rider_avatar} className="size-8 rounded-lg object-cover" alt="rider" />}
                              <div>
                                <p className="font-black text-slate-900">{r.rider_name}</p>
                                <p className="text-slate-400">Rider · #{r.id}</p>
                              </div>
                            </div>
                            <p><span className="font-bold">📍 Pickup:</span> {r.pickup_address}</p>
                            <p><span className="font-bold">🏁 Dest:</span> {r.destination_address}</p>
                            <p><span className="font-bold">Status:</span> <span className={`px-1.5 py-0.5 rounded font-bold ${
                              r.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>{r.status}</span></p>
                            <p><span className="font-bold">Fare:</span> PGK {r.fare}</p>
                            {r.driver_name && <p><span className="font-bold">Driver:</span> {r.driver_name} · {r.car_plate}</p>}
                          </div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            )}

            {/* Ride legend table below the map */}
            {liveRides.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm">Active Rides Summary</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {liveRides.map(r => (
                    <div key={r.id} className="px-5 py-3 flex items-center gap-3 flex-wrap">
                      <Avatar src={r.rider_avatar} name={r.rider_name} size={8} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900">{r.rider_name} → {r.driver_name || 'Awaiting driver'}</p>
                        <p className="text-xs text-slate-400 truncate">{r.pickup_address}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status.replace('_',' ')}</span>
                      <span className="text-xs font-black text-slate-700 whitespace-nowrap">PGK {r.fare}</span>
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded-lg disabled:opacity-50"
                      >
                        {cancellingId === r.id ? '...' : '🚨 Cancel'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIDES TAB */}
        {!loading && tab === 'rides' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-black text-slate-900 text-lg flex-1">All Rides</h2>
              {['all','pending','accepted','in_progress','completed','cancelled'].map(s => (
                <button key={s} onClick={() => setRideFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${rideFilter === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>{['#','Rider','Driver','Status','Fare','Distance','Created'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rides.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">#{r.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar src={r.rider_avatar} name={r.rider_name} size={7} />
                            <div><p className="font-bold text-slate-900 text-xs">{r.rider_name}</p><p className="text-slate-400 text-[10px]">{r.rider_email}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {r.driver_name ? (
                            <div className="flex items-center gap-2">
                              <Avatar src={r.driver_avatar} name={r.driver_name} size={7} />
                              <div><p className="font-bold text-slate-900 text-xs">{r.driver_name}</p><p className="text-slate-400 text-[10px]">{r.car_plate}</p></div>
                            </div>
                          ) : <span className="text-slate-300 text-xs italic">Unassigned</span>}
                        </td>
                        <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                        <td className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">PGK {r.fare}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{r.distance}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rides.length === 0 && <div className="text-center py-12 text-slate-400 font-bold">No rides found</div>}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {!loading && tab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-black text-slate-900 text-lg flex-1">All Users</h2>
              {['all','rider','driver','admin'].map(r => (
                <button key={r} onClick={() => setUserFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${userFilter === r ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {users.map(u => (
                <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
                  <Avatar src={u.avatar_url} name={u.name} size={12} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900 text-sm truncate">{u.name}</p>
                      {u.is_online && <span className="size-2 bg-green-400 rounded-full shrink-0" title="Online" />}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' :
                        u.role === 'driver' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>{u.role}</span>
                      <span className="text-[10px] text-slate-400">⭐ {parseFloat(u.average_rating || 5).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-bold">PGK {u.wallet_balance}</span>
                    </div>
                    {u.car_model && <p className="text-[10px] text-slate-400 mt-0.5">🚗 {u.car_model} · {u.car_plate}</p>}
                  </div>
                </div>
              ))}
              {users.length === 0 && <div className="col-span-3 text-center py-12 text-slate-400 font-bold">No users found</div>}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {!loading && tab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="font-black text-slate-900 text-lg">Safety Reviews</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {reviews.map(rv => (
                <div key={rv.id} className={`bg-white rounded-2xl shadow-sm border p-4 space-y-2 ${rv.rating <= 2 ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
                  {rv.rating <= 2 && <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold"><span>⚠️</span> Low Rating — Review Required</div>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={rv.reviewer_avatar} name={rv.reviewer_name} size={8} />
                      <div>
                        <p className="font-bold text-sm text-slate-900">{rv.reviewer_name}</p>
                        <p className="text-[10px] text-slate-400">reviewed {rv.reviewee_name} ({rv.reviewee_role})</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-sm ${rv.rating >= s ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {rv.comment && <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 italic">"{rv.comment}"</p>}
                  <p className="text-[10px] text-slate-400">{new Date(rv.created_at).toLocaleString()}</p>
                </div>
              ))}
              {reviews.length === 0 && <div className="col-span-2 text-center py-12 text-slate-400 font-bold">No reviews yet</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
