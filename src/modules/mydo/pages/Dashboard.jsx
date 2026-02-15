import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Briefcase, MapPin, Download, Loader2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { MydoService } from '../services/MYDOService';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalYouth: 0,
    outOfSchool: 0,
    employed: 0,
    activePuroks: 0
  });
  const [activities, setActivities] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null); // ID of user being processed

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Load existing stats
        const [statsData, logsData] = await Promise.all([
          MydoService.getDashboardStats(),
          MydoService.getRecentActivities()
        ]);
        setStats(statsData);
        setActivities(logsData || []);

        // Load Access Requests
        const { data: requests, error } = await supabase
            .from('users')
            .select('*')
            .eq('status', 'Pending')
            .order('created_at', { ascending: false });

        if (!error) setAccessRequests(requests || []);

      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleApprove = async (userId) => {
    if (!confirm("Approve access for this user?")) return;
    setIsProcessing(userId);
    try {
        // 1. Get User Details
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        // 2. Update Status to Active
        const { error: updateError } = await supabase
            .from('users')
            .update({ status: 'Active' })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 3. AUTO-CREATE SK OFFICIAL RECORD (If SK Chair)
        if (userData.role === 'SK_CHAIR') {
            // Check if exists first to avoid duplicates
            const { data: existing } = await supabase
                .from('sk_officials')
                .select('id')
                .eq('barangay', userData.barangay)
                .eq('position', 'SK Chairperson')
                .single();

            if (!existing) {
                const { error: insertError } = await supabase
                    .from('sk_officials')
                    .insert([{
                        name: `${userData.first_name} ${userData.last_name}`,
                        position: 'SK Chairperson',
                        barangay: userData.barangay,
                        status: 'Active',
                        skmt_no: `SK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-gen
                        gender: 'Male' // Default, editable later
                    }]);

                if (insertError) console.error("Failed to auto-create SK Official record:", insertError);
            }
        }

        // Remove from list
        setAccessRequests(prev => prev.filter(u => u.id !== userId));
        alert("User approved successfully.");
    } catch (err) {
        console.error(err);
        alert("Failed to approve user.");
    } finally {
        setIsProcessing(null);
    }
  };

  const handleReject = async (userId) => {
    if (!confirm("Reject this request? This will mark the account as Rejected.")) return;
    setIsProcessing(userId);
    try {
        const { error } = await supabase.from('users').update({ status: 'Rejected' }).eq('id', userId);
        if (error) throw error;
        // Remove from list
        setAccessRequests(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
        console.error(err);
        alert("Failed to reject user.");
    } finally {
        setIsProcessing(null);
    }
  };

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

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ACCESS REQUESTS CARD (NEW) */}
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
                    <Shield className="text-[#2E5E99] dark:text-blue-400" size={18}/> Access Requests
                </h3>
                {accessRequests.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{accessRequests.length} New</span>}
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {accessRequests.length > 0 ? (
                    accessRequests.map((req) => (
                        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-sm font-bold text-[#0D2440] dark:text-white">{req.first_name} {req.last_name}</p>
                                <p className="text-xs text-[#7BA4D0] dark:text-slate-400">
                                    {req.role === 'SK_CHAIR' ? 'SK Chairperson' : req.role} • {req.barangay}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{req.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(req.id)}
                                    disabled={isProcessing === req.id}
                                    className="p-1.5 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors" title="Approve"
                                >
                                    <CheckCircle size={18} />
                                </button>
                                <button
                                    onClick={() => handleReject(req.id)}
                                    disabled={isProcessing === req.id}
                                    className="p-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="Reject"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle className="text-green-500 w-8 h-8 mb-2 opacity-50" />
                        <p className="text-gray-400 dark:text-slate-500 text-sm">All pending requests approved.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col gap-6">
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
            <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/50 transition-colors h-full">
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
    </div>
  );
};

export default Dashboard;
