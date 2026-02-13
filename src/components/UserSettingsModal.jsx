import React, { useState, useEffect } from 'react';
import { 
  User, Settings, FileClock, X, Save, 
  Shield, Bell, Laptop, Key, CheckCircle2, 
  AlertCircle, Moon
} from 'lucide-react';
import mydoLogo from '../assets/mydo logo.png';

const UserSettingsModal = ({ isOpen, onClose, initialTab = 'profile', isDarkMode, setIsDarkMode }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const accountLogs = [
    { id: 1, action: "Logged in successfully", date: "Feb 11, 2026 - 08:30 AM", device: "Chrome / Windows", ip: "192.168.1.45", status: "Success" },
    { id: 2, action: "Exported SK Profiles (Dalakit)", date: "Feb 10, 2026 - 03:15 PM", device: "Chrome / Windows", ip: "192.168.1.45", status: "Success" },
    { id: 3, action: "Failed login attempt", date: "Feb 09, 2026 - 11:20 AM", device: "Safari / iPhone", ip: "112.201.55.12", status: "Warning" },
    { id: 4, action: "Updated System Settings", date: "Feb 08, 2026 - 09:00 AM", device: "Chrome / Windows", ip: "192.168.1.45", status: "Success" },
  ];

  return (
    <>
      {/* Dark Backdrop */}
      <div className="fixed inset-0 bg-[#0D2440]/40 backdrop-blur-sm z-60 animate-in fade-in duration-200" onClick={onClose}></div>

      {/* SINGLE Modal Container (Fixed the duplicate issue) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-150 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-70 flex overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* --- LEFT SIDEBAR (TABS) --- */}
        <div className="w-64 bg-gray-50 dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
             <h2 className="font-black text-[#0D2440] dark:text-white text-lg">Account</h2>
             <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400">
               <X size={18} />
             </button>
          </div>
          
          <div className="p-4 flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-[#0D2440] dark:text-white shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white'}`}
            >
              <User size={18} className={activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400' : ''} /> My Profile
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-white dark:bg-slate-700 text-[#0D2440] dark:text-white shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white'}`}
            >
              <FileClock size={18} className={activeTab === 'logs' ? 'text-purple-600 dark:text-purple-400' : ''} /> Account Logs
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-700 text-[#0D2440] dark:text-white shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white'}`}
            >
              <Settings size={18} className={activeTab === 'settings' ? 'text-amber-600 dark:text-amber-400' : ''} /> System Settings
            </button>
          </div>
        </div>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900 transition-colors">
          
          {/* TAB 1: MY PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-[#0D2440] dark:text-white mb-6">Profile Information</h3>
              
              <div className="flex items-center gap-6 mb-8 p-6 bg-blue-50/50 dark:bg-slate-800 rounded-2xl border border-blue-100/50 dark:border-slate-700">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-700 shadow-md overflow-hidden bg-white">
                  <img src={mydoLogo} alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0D2440] dark:text-white">Admin User</h4>
                  <p className="text-sm text-[#7BA4D0] dark:text-gray-400 font-medium">System Administrator</p>
                  <button className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Change Photo</button>
                </div>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                    <input type="text" defaultValue="Admin User" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#0D2440] dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Role</label>
                    <input type="text" defaultValue="System Administrator" disabled className="w-full p-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed opacity-70" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Email Address</label>
                    <input type="email" defaultValue="admin@mydo.catarman.gov.ph" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#0D2440] dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Contact Number</label>
                    <input type="text" defaultValue="+63 912 345 6789" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#0D2440] dark:text-white outline-none focus:border-blue-500" />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-6 py-3 bg-[#0D2440] dark:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-[#0D2440]/20 hover:bg-[#1a3b5e] dark:hover:bg-blue-700 transition-all">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ACCOUNT LOGS */}
          {activeTab === 'logs' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-[#0D2440] dark:text-white mb-2">Activity Logs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Track recent logins and administrative actions on your account.</p>

              <div className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="p-4">Action & Date</th>
                      <th className="p-4">Device / IP</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {accountLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <p className="text-sm font-bold text-[#0D2440] dark:text-gray-200">{log.action}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5">{log.date}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                            <Laptop size={14} className="text-gray-400" /> {log.device}
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{log.ip}</p>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            log.status === 'Success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {log.status === 'Success' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-[#0D2440] dark:text-white mb-6">System Settings</h3>
              
              <div className="space-y-6">
                
                {/* Appearance Section */}
                <div className="p-5 border border-gray-100 dark:border-slate-700 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><Moon size={20} /></div>
                    <h4 className="font-bold text-[#0D2440] dark:text-white">Appearance</h4>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-gray-50 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Night Mode</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Switch to a darker theme for low-light environments.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      
                      {/* CONNECTED THE TOGGLE TO STATE HERE */}
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isDarkMode} 
                        onChange={() => setIsDarkMode(!isDarkMode)} 
                      />

                      <div className="w-9 h-5 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Security Section */}
                <div className="p-5 border border-gray-100 dark:border-slate-700 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><Shield size={20} /></div>
                    <h4 className="font-bold text-[#0D2440] dark:text-white">Security</h4>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-gray-50 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Change Password</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Update your administrator password regularly.</p>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-xs font-bold text-[#0D2440] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
                      <Key size={14} /> Update
                    </button>
                  </div>
                </div>

                {/* Notifications Section */}
                <div className="p-5 border border-gray-100 dark:border-slate-700 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Bell size={20} /></div>
                    <h4 className="font-bold text-[#0D2440] dark:text-white">Notifications</h4>
                  </div>
                  
                  {/* Toggle 1 */}
                  <div className="flex justify-between items-center py-3 border-t border-gray-50 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Email Alerts</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Receive emails for new profile registrations and report submissions.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex justify-between items-center py-3 border-t border-gray-50 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">System Warnings</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Show alerts for failed login attempts or server errors.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default UserSettingsModal;