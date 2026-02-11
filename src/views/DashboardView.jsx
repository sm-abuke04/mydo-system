import React from 'react';
import { Users, GraduationCap, Briefcase, MapPin, Download } from 'lucide-react';

const DashboardView = () => {
  const stats = [
    { label: 'Total Youth', value: '1,247', change: '+12%', icon: Users },
    { label: 'Out-of-School Youth', value: '186', change: '14.9%', icon: GraduationCap },
    { label: 'Employed', value: '743', change: '59.6%', icon: Briefcase },
    { label: 'Active Puroks', value: '8', change: '100%', icon: MapPin }
  ];

  return (
    // MAIN CONTAINER
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#7BA4D0]/20 dark:border-slate-800 p-8 min-h-full transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white transition-colors">Dashboard</h2>
          <p className="text-sm text-[#7BA4D0] dark:text-slate-400 transition-colors">Real-time youth statistics</p>
        </div>
        <button className="bg-[#0D2440] hover:bg-[#2E5E99] dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm">
          <Download size={18} /> <span className="font-medium">Export Data</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#7BA4D0]/10 dark:border-slate-700 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#7BA4D0] dark:text-slate-400 transition-colors">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0D2440] dark:text-white mt-1 transition-colors">{stat.value}</p>
              </div>
              <div className="p-3 bg-[#E7F0FA] dark:bg-blue-900/30 rounded-xl text-[#2E5E99] dark:text-blue-400 transition-colors">
                <stat.icon size={22} />
              </div>
            </div>
            <p className="text-xs font-bold mt-4 text-[#2E5E99] dark:text-blue-400 transition-colors">{stat.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RECENT ACTIVITIES */}
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="font-bold text-[#0D2440] dark:text-white mb-4 transition-colors">Recent Activities</h3>
          <div className="space-y-4 text-sm">
            {["Juan Dela Cruz registered", "Leadership Summit 2026", "Monthly Report"].map((act, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 dark:border-slate-700/50">
                <span className="text-[#0D2440] dark:text-slate-200 font-medium transition-colors">{act}</span>
                <span className="text-[#7BA4D0] dark:text-slate-400 transition-colors">Today</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/50 transition-colors">
          <h3 className="font-bold text-[#0D2440] dark:text-white mb-4 transition-colors">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
             <button className="p-3 bg-white dark:bg-slate-800 border border-[#d1e3f8] dark:border-slate-600 rounded-xl text-xs font-bold text-[#2E5E99] dark:text-blue-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-700 transition-all">
               Add Youth
             </button>
             <button className="p-3 bg-white dark:bg-slate-800 border border-[#d1e3f8] dark:border-slate-600 rounded-xl text-xs font-bold text-[#2E5E99] dark:text-blue-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-700 transition-all">
               Map Update
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;