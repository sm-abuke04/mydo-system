import React from 'react';
import { 
  User, Settings, LogOut, FileClock, 
  ChevronRight 
} from 'lucide-react';
import mydoLogo from '../assets/mydo logo.png';

// ADDED onOpenSettings to props
const SettingsModal = ({ isOpen, onClose, onOpenSettings }) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-enter {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[40]" onClick={onClose}></div>

      {/* DROPDOWN CONTAINER */}
      <div className="animate-modal-enter absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 z-[50] overflow-hidden origin-top-right transition-colors duration-300">
        
        {/* User Header */}
        <div className="bg-[#0D2440] dark:bg-slate-950 p-6 text-white text-center relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 p-1 rounded-full mb-3 shadow-lg transition-colors">
                    <img src={mydoLogo} alt="User" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-white">Admin User</h3>
                <p className="text-xs text-blue-200 dark:text-blue-400 uppercase tracking-widest font-semibold transition-colors">System Administrator</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1 bg-white dark:bg-slate-900 transition-colors">
            
            {/* My Profile */}
            <button 
              onClick={() => onOpenSettings('profile')}
              className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
            >
                <div className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg group-hover:text-[#0D2440] dark:group-hover:text-white transition-colors">
                  <User size={18} />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-[#0D2440] dark:text-white font-bold transition-colors">My Profile</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 transition-colors">Account details & personal info</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-[#0D2440] dark:group-hover:text-white transition-colors" />
            </button>

            {/* Account Logs */}
            <button 
              onClick={() => onOpenSettings('logs')}
              className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
            >
                <div className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg group-hover:text-[#0D2440] dark:group-hover:text-white transition-colors">
                  <FileClock size={18} />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-[#0D2440] dark:text-white font-bold transition-colors">Account Logs</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 transition-colors">Recent login activity & history</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-[#0D2440] dark:group-hover:text-white transition-colors" />
            </button>

            {/* System Settings */}
            <button 
              onClick={() => onOpenSettings('settings')}
              className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
            >
                <div className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg group-hover:text-[#0D2440] dark:group-hover:text-white transition-colors">
                  <Settings size={18} />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-[#0D2440] dark:text-white font-bold transition-colors">System Settings</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 transition-colors">Preferences & configurations</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-[#0D2440] dark:group-hover:text-white transition-colors" />
            </button>

        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-slate-800 my-1 mx-4 transition-colors"></div>

        {/* Logout Section */}
        <div className="p-2 bg-white dark:bg-slate-900 transition-colors">
            <button className="w-full flex items-center gap-3 p-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors group">
                <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                  <LogOut size={18} />
                </div>
                <span className="font-bold">Sign Out</span>
            </button>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-3 border-t border-gray-100 dark:border-slate-800 text-center transition-colors">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 transition-colors">MYDO System v1.0.2</p>
        </div>

      </div>
    </>
  );
};

export default SettingsModal;