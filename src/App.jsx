import React, { useState, useEffect } from 'react'; // <-- 1. ADDED useEffect
import { Bell, Search, User, Home, Users, Map, FileText, Menu } from 'lucide-react';
import mydoLogo from './assets/mydo logo.png'; 
import DashboardView from './views/DashboardView';
import ProfilesView from './views/ProfilesView';
import MapView from './views/MapView';
import ReportsView from './views/ReportsView';
import SettingsModal from './components/SettingsModal';
import NotificationModal from './components/NotificationModal';
import UserSettingsModal from './components/UserSettingsModal';

export default function App() {
  const [isSidebarShrinked, setIsSidebarShrinked] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [userSettingsTab, setUserSettingsTab] = useState('profile');

  // --- 2. ADDED DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 3. ADDED LOGIC TO TELL THE BROWSER TO SWITCH COLORS ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Function to open specific tab from the dropdown
  const handleOpenSettings = (tab) => {
    setUserSettingsTab(tab);
    setIsUserSettingsOpen(true);
    setIsProfileOpen(false); // Close the dropdown menu
  };

  return (
    // 4. ADDED 'dark:bg-slate-900' to the main background
    <div className="h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col overflow-hidden relative">
      
      {/* HEADER - ADDED 'dark:bg-slate-900' */}
      <header className="flex items-center justify-between px-10 py-6 shrink-0 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 z-20">
        <div className="flex items-center gap-6 flex-1">
          <button 
            onClick={() => setIsSidebarShrinked(!isSidebarShrinked)}
            className="hover:bg-gray-200/50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#0D2440] dark:text-white" />
          </button>
          <span className="text-xl font-bold text-[#0D2440] dark:text-white">MYDO SYSTEM</span>
        </div>

        <div className="flex justify-center flex-1">
          <img src={mydoLogo} alt="Logo" className="w-16 h-16 rounded-full shadow-lg object-cover" />
        </div>

        <div className="flex items-center justify-end gap-4 flex-1 relative">
          <div className="relative w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0]" />
            <input
              type="text"
              placeholder="Search..."
              style={{ backgroundColor: isDarkMode ? '#1e293b' : '#e7f0fa' }} // Adjust search bar color
              className="w-full pl-10 pr-4 py-2 border border-[#d1e3f8] dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm text-[#0D2440] dark:text-white"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className={`p-2.5 rounded-full transition-all relative ${isNotifOpen ? 'bg-blue-100 text-[#0D2440]' : 'text-[#2E5E99] dark:text-blue-300 hover:text-[#0D2440] hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isProfileOpen ? 'bg-[#2E5E99] text-white ring-4 ring-[#2E5E99]/20' : 'bg-[#0D2440] text-white hover:bg-[#1a3b5e]'}`}
            >
              <User className="w-5 h-5" />
            </button>
            
            <SettingsModal 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
              onOpenSettings={handleOpenSettings} 
            />
          </div>

          {/* 5. PASSED DARK MODE STATE TO YOUR SETTINGS MODAL */}
          <UserSettingsModal 
            isOpen={isUserSettingsOpen} 
            onClose={() => setIsUserSettingsOpen(false)} 
            initialTab={userSettingsTab} 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

        </div>
      </header>

      {/* CONTENT WRAPPER */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <nav className={`pl-10 pr-4 py-2 space-y-2 transition-all duration-300 shrink-0 overflow-y-auto ${isSidebarShrinked ? 'w-24' : 'w-72'}`}>
          <button 
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              activeMenu === 'dashboard' ? 'bg-[#0D2440] dark:bg-blue-600 text-white shadow-lg' : 'text-[#7BA4D0] dark:text-gray-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-800'
            }`}>
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isSidebarShrinked && <span className="font-semibold text-sm">Dashboard</span>}
          </button>
          
          <button 
            onClick={() => setActiveMenu('youth')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              activeMenu === 'youth' ? 'bg-[#0D2440] dark:bg-blue-600 text-white shadow-lg' : 'text-[#7BA4D0] dark:text-gray-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-800'
            }`}>
            <Users className="w-5 h-5 flex-shrink-0" />
            {!isSidebarShrinked && <span className="font-semibold text-sm">SK Profiles</span>}
          </button>
          
          <button 
            onClick={() => setActiveMenu('map')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              activeMenu === 'map' ? 'bg-[#0D2440] dark:bg-blue-600 text-white shadow-lg' : 'text-[#7BA4D0] dark:text-gray-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-800'
            }`}>
            <Map className="w-5 h-5 flex-shrink-0" />
            {!isSidebarShrinked && <span className="font-semibold text-sm">Brgy Map</span>}
          </button>
          
          <button 
            onClick={() => setActiveMenu('reports')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              activeMenu === 'reports' ? 'bg-[#0D2440] dark:bg-blue-600 text-white shadow-lg' : 'text-[#7BA4D0] dark:text-gray-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-800'
            }`}>
            <FileText className="w-5 h-5 flex-shrink-0" />
            {!isSidebarShrinked && <span className="font-semibold text-sm">Reports</span>}
          </button>
        </nav>

        {/* MAIN AREA */}
        <main className={`flex-1 h-full pr-10 pb-10 pl-2 transition-all ${
          (activeMenu === 'map' || activeMenu === 'reports') ? 'overflow-hidden' : 'overflow-y-auto'
        }`}>
          {activeMenu === 'dashboard' && <DashboardView />}
          {activeMenu === 'youth' && <ProfilesView />}
          
          <div className="h-full">
            {activeMenu === 'map' && <MapView />}
            {activeMenu === 'reports' && <ReportsView />}
          </div>
        </main>

      </div>
    </div>
  );
}