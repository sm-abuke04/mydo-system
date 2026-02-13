import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Briefcase, MapPin, Download, Loader2 } from 'lucide-react';
import { MydoService } from '../services/MYDOService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalYouth: 0,
    outOfSchool: 0,
    employed: 0,
    activePuroks: 0
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, logsData] = await Promise.all([
          MydoService.getDashboardStats(),
          MydoService.getRecentActivities()
        ]);
        setStats(statsData);
        setActivities(logsData || []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Youth', value: stats.totalYouth, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Out-of-School', value: stats.outOfSchool, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Employed', value: stats.employed, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Barangays', value: stats.activePuroks, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[#7BA4D0]/20 dark:border-slate-800 p-8 min-h-full transition-colors duration-300">
      
      {/* HEADER */}
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
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#7BA4D0]/10 dark:border-slate-700 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#7BA4D0] dark:text-slate-400 transition-colors">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0D2440] dark:text-white mt-1 transition-colors">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10 transition-colors`}>
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RECENT ACTIVITIES */}
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="font-bold text-[#0D2440] dark:text-white mb-4 transition-colors">Recent Activities</h3>
          <div className="space-y-4 text-sm">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex justify-between py-2 border-b border-gray-50 dark:border-slate-700/50">
                  <span className="text-[#0D2440] dark:text-slate-200 font-medium transition-colors">{act.description}</span>
                  <span className="text-[#7BA4D0] dark:text-slate-400 transition-colors text-xs">
                    {new Date(act.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">No recent activities recorded.</p>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/50 transition-colors">
          <h3 className="font-bold text-[#0D2440] dark:text-white mb-4 transition-colors">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
             <button className="p-3 bg-white dark:bg-slate-800 border border-[#d1e3f8] dark:border-slate-600 rounded-xl text-xs font-bold text-[#2E5E99] dark:text-blue-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-700 transition-all">
               Generate Summary Report
             </button>
             <button className="p-3 bg-white dark:bg-slate-800 border border-[#d1e3f8] dark:border-slate-600 rounded-xl text-xs font-bold text-[#2E5E99] dark:text-blue-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-700 transition-all">
               Broadcast Notification
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;