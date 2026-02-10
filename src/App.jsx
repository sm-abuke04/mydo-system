import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Search, User, Home, Users, Map, FileText, Menu, LogOut, Loader2, ShieldCheck, Clock } from 'lucide-react';
import mydoLogo from './assets/mydo logo.png'; 
import DashboardView from './views/DashboardView';
import ProfilesView from './views/ProfilesView';
import MapView from './views/MapView';
import RequestsView from './views/RequestsView';
import LoginView from './components/LoginView';
import SKHomeView from './views/SKHomeView'; 
import { supabase } from './supabaseClient';

export default function App() {
  const [isSidebarShrinked, setIsSidebarShrinked] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (err) {
      console.error("Auth Profile Error:", err.message);
      setUserProfile({ role: 'SK', status: 'PENDING' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { if(loading) setLoading(false); }, 5000);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setUserProfile(null); setLoading(false); }
    });

    return () => { subscription.unsubscribe(); clearTimeout(timer); };
  }, [fetchProfile]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#0D2440] animate-spin mb-4" />
      <p className="text-[10px] font-black text-[#7BA4D0] uppercase tracking-widest">Initializing...</p>
    </div>
  );

  if (!session) return <LoginView />;

  // --- START OF APPROVAL GATE ---
  // If the user is an SK, check their status first
  if (userProfile?.role === 'SK') {
    if (userProfile?.status !== 'APPROVED') {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center font-sans">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">Account Pending Approval</h2>
          <p className="text-gray-400 max-w-sm mt-2 text-sm">
            Hello, <strong>{userProfile?.full_name || 'Official'}</strong>. Your SK account has been registered but requires 
            Admin verification before you can access your dashboard.
          </p>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="mt-8 px-10 py-4 bg-[#0D2440] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all"
          >
            Sign Out
          </button>
        </div>
      );
    }
    // Only show SKHomeView if status is 'APPROVED'
    return <SKHomeView userProfile={userProfile} />;
  }
  // --- END OF APPROVAL GATE ---

  // MYDO Admin / Officers see the management UI
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
      <header className="flex items-center justify-between px-10 py-6 shrink-0 bg-white/50 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-6 flex-1">
          <button onClick={() => setIsSidebarShrinked(!isSidebarShrinked)} className="hover:bg-gray-200/50 p-2 rounded-lg transition-all">
            <Menu className="w-6 h-6 text-[#0D2440]" />
          </button>
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#0D2440] uppercase tracking-tighter">MYDO Catarman</span>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{userProfile?.role}</span>
               <div className={`w-1.5 h-1.5 rounded-full ${userProfile?.status === 'APPROVED' ? 'bg-green-500 shadow-green-200' : 'bg-amber-500 shadow-amber-200'} shadow-sm`} />
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{userProfile?.status}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-1">
          <img src={mydoLogo} alt="Logo" className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover" />
        </div>
        <div className="flex items-center justify-end gap-4 flex-1">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0]" />
            <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2 bg-[#e7f0fa] border border-[#d1e3f8] rounded-xl outline-none text-sm transition-all focus:bg-white" />
          </div>
          <button onClick={() => supabase.auth.signOut()} className="w-10 h-10 bg-[#0D2440] hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-md transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className={`pl-10 pr-4 py-2 space-y-2 transition-all duration-300 shrink-0 ${isSidebarShrinked ? 'w-24' : 'w-72'}`}>
          <button onClick={() => setActiveMenu('dashboard')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeMenu === 'dashboard' ? 'bg-[#0D2440] text-white shadow-lg' : 'text-[#7BA4D0] hover:bg-[#e7f0fa]'}`}>
            <Home size={20} className="shrink-0" /> {!isSidebarShrinked && <span className="font-semibold text-sm">Dashboard</span>}
          </button>
          <button onClick={() => setActiveMenu('youth')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeMenu === 'youth' ? 'bg-[#0D2440] text-white shadow-lg' : 'text-[#7BA4D0] hover:bg-[#e7f0fa]'}`}>
            <Users size={20} className="shrink-0" /> {!isSidebarShrinked && <span className="font-semibold text-sm">SK Profiles</span>}
          </button>
          <button onClick={() => setActiveMenu('map')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeMenu === 'map' ? 'bg-[#0D2440] text-white shadow-lg' : 'text-[#7BA4D0] hover:bg-[#e7f0fa]'}`}>
            <Map size={20} className="shrink-0" /> {!isSidebarShrinked && <span className="font-semibold text-sm">Barangay Map</span>}
          </button>
        </nav>
        <main className="flex-1 pr-10 pb-10 overflow-y-auto">
          {activeMenu === 'dashboard' && <DashboardView userProfile={userProfile} />}
          {activeMenu === 'youth' && <ProfilesView />}
          {activeMenu === 'map' && <MapView />}
        </main>
      </div>
    </div>
  );
}