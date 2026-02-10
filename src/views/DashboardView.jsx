// import React, { useEffect, useState } from 'react';
// import { Users, GraduationCap, Briefcase, MapPin, Download, Loader2, CheckCircle, Trash2, Clock } from 'lucide-react';
// import { supabase } from '../supabaseClient';

// const DashboardView = () => {
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [counts, setCounts] = useState({
//     total: 0,
//     active: 0,
//     female: 0,
//     brgyCount: 0
//   });
//   const [recentNames, setRecentNames] = useState([]);
//   const [pendingUsers, setPendingUsers] = useState([]);

//   const getDashboardData = async () => {
//     try {
//       setLoading(true);

//       // 1. Fetch ALL profiles to verify counts
//       const { data: allProfiles, error: countError } = await supabase
//         .from('profiles')
//         .select('*');

//       if (countError) throw countError;

//       // 2. Filter data manually for accuracy
//       const pending = allProfiles.filter(p => p.status === 'PENDING');
//       const approved = allProfiles.filter(p => p.status === 'APPROVED');
      
//       // 3. Get Female Count from 'youths' table
//       const { count: femaleCount } = await supabase
//         .from('youths')
//         .select('*', { count: 'exact', head: true })
//         .eq('gender', 'Female');

//       // 4. Calculate Unique Barangays from profiles
//       const uniqueBrgys = new Set(allProfiles.map(p => p.barangay_id).filter(id => id !== null));

//       // 5. Update State
//       setCounts({
//         total: allProfiles.length,
//         active: approved.length,
//         female: femaleCount || 0,
//         brgyCount: uniqueBrgys.size
//       });

//       // Show the last 3 registered
//       const sortedLatest = [...allProfiles]
//         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//         .slice(0, 3);
      
//       setRecentNames(sortedLatest);
//       setPendingUsers(pending);

//       console.log("Debug - Pending Users found:", pending);

//     } catch (error) {
//       console.error("Dashboard Sync Error:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getDashboardData();
//   }, []);

//   const handleApprove = async (id) => {
//     setActionLoading(id);
//     const { error } = await supabase
//       .from('profiles')
//       .update({ status: 'APPROVED' })
//       .eq('id', id);
    
//     if (error) {
//       alert("Error: " + error.message);
//     } else {
//       alert("Account Approved!");
//       getDashboardData();
//     }
//     setActionLoading(null);
//   };

//   const handleDelete = async (id) => {
//     if(!window.confirm("Delete this request?")) return;
//     setActionLoading(id);
//     const { error } = await supabase.from('profiles').delete().eq('id', id);
//     if (error) alert(error.message);
//     else getDashboardData();
//     setActionLoading(null);
//   };

//   const stats = [
//     { label: 'Total Accounts', value: counts.total.toLocaleString(), change: 'Live', icon: Users },
//     { label: 'Approved Members', value: counts.active.toLocaleString(), change: `${((counts.active/counts.total)*100 || 0).toFixed(1)}%`, icon: GraduationCap },
//     { label: 'Female Youth', value: counts.female.toLocaleString(), change: 'Gender Split', icon: Briefcase },
//     { label: 'Barangays Covered', value: counts.brgyCount.toLocaleString(), change: 'Out of 55', icon: MapPin }
//   ];

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-[#7BA4D0]/20 p-8 min-h-full">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-[#0D2440]">Dashboard</h2>
//           <p className="text-sm text-[#7BA4D0]">Real-time account statistics</p>
//         </div>
//         <button className="bg-[#0D2440] hover:bg-[#2E5E99] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm">
//           <Download size={18} /> <span className="font-medium">Export Data</span>
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="animate-spin text-indigo-600" size={40} />
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {stats.map((stat, i) => (
//               <div key={i} className="bg-white p-6 rounded-2xl border border-[#7BA4D0]/10 hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-[#7BA4D0]">{stat.label}</p>
//                     <p className="text-2xl font-bold text-[#0D2440] mt-1">{stat.value}</p>
//                   </div>
//                   <div className="p-3 bg-[#E7F0FA] rounded-xl text-[#2E5E99]">
//                     <stat.icon size={22} />
//                   </div>
//                 </div>
//                 <p className="text-xs font-bold mt-4 text-[#2E5E99]">{stat.change}</p>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="p-6 rounded-2xl border border-gray-100 lg:col-span-1">
//               <h3 className="font-bold text-[#0D2440] mb-4">Recent Profiles</h3>
//               <div className="space-y-4 text-sm">
//                 {recentNames.length > 0 ? recentNames.map((act, i) => (
//                   <div key={i} className="flex justify-between py-2 border-b border-gray-50">
//                     <span className="text-[#0D2440] font-medium">
//                         {act.first_name ? `${act.first_name} ${act.last_name}` : "User " + act.id.substring(0,5)}
//                     </span>
//                     <span className="text-[#7BA4D0]">{act.status}</span>
//                   </div>
//                 )) : (
//                   <p className="text-gray-400 italic">No recent profiles</p>
//                 )}
//               </div>
//             </div>

//             <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/20 lg:col-span-1">
//               <div className="flex items-center gap-2 mb-4">
//                 <Clock className="text-amber-600" size={18} />
//                 <h3 className="font-bold text-[#0D2440]">Pending SK Accounts</h3>
//               </div>
//               <div className="space-y-3">
//                 {pendingUsers.length > 0 ? pendingUsers.map((user) => (
//                   <div key={user.id} className="bg-white p-3 rounded-xl border border-amber-100 flex justify-between items-center shadow-sm">
//                     <div>
//                       <p className="text-xs font-bold text-[#0D2440]">
//                           {user.first_name ? `${user.first_name} ${user.last_name}` : "Pending User"}
//                       </p>
//                       <p className="text-[10px] text-gray-400 uppercase font-bold">{user.role}</p>
//                     </div>
//                     <div className="flex gap-1">
//                       <button 
//                         onClick={() => handleApprove(user.id)}
//                         disabled={actionLoading === user.id}
//                         className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                       >
//                         {actionLoading === user.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={18} />}
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(user.id)}
//                         disabled={actionLoading === user.id}
//                         className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 )) : (
//                   <div className="text-center py-6">
//                       <p className="text-xs text-gray-400 italic">No pending accounts found.</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/30 lg:col-span-1">
//               <h3 className="font-bold text-[#0D2440] mb-4">System Actions</h3>
//               <div className="grid grid-cols-2 gap-3">
//                  <button className="p-3 bg-white border border-[#d1e3f8] rounded-xl text-xs font-bold text-[#2E5E99] hover:shadow-sm transition-all">Add SK</button>
//                  <button className="p-3 bg-white border border-[#d1e3f8] rounded-xl text-xs font-bold text-[#2E5E99] hover:shadow-sm transition-all">User Logs</button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DashboardView;

import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Briefcase, MapPin, Download, Loader2, CheckCircle, Trash2, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';

const DashboardView = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    female: 0,
    brgyCount: 0
  });
  const [recentNames, setRecentNames] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  const getDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch profiles AND the related barangay name
      // Note: This assumes 'profiles' has a foreign key to 'barangays'
      const { data: allProfiles, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          barangays (
            name
          )
        `);

      if (profileError) throw profileError;

      // 2. Filter logic
      const pending = allProfiles.filter(p => p.status === 'PENDING');
      const approved = allProfiles.filter(p => p.status === 'APPROVED');
      
      // 3. Get Female Count from 'youths'
      const { count: femaleCount } = await supabase
        .from('youths')
        .select('*', { count: 'exact', head: true })
        .eq('gender', 'Female');

      // 4. Calculate stats
      const uniqueBrgys = new Set(allProfiles.map(p => p.barangay_id).filter(id => id !== null));

      setCounts({
        total: allProfiles.length,
        active: approved.length,
        female: femaleCount || 0,
        brgyCount: uniqueBrgys.size
      });

      // Sort by latest update
      const sortedLatest = [...allProfiles]
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3);
      
      setRecentNames(sortedLatest);
      setPendingUsers(pending);

    } catch (error) {
      console.error("Dashboard Load Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'APPROVED' }) //
        .eq('id', id);
      
      if (error) throw error;
      alert("Account Approved!");
      await getDashboardData();
    } catch (error) {
      alert("Failed to approve: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Reject and delete this account request?")) return;
    try {
      setActionLoading(id);
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      await getDashboardData();
    } catch (error) {
      alert("Failed to delete: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const stats = [
    { label: 'Total Accounts', value: counts.total.toLocaleString(), change: 'Live', icon: Users },
    { label: 'Approved Members', value: counts.active.toLocaleString(), change: `${((counts.active/counts.total)*100 || 0).toFixed(1)}%`, icon: GraduationCap },
    { label: 'Female Youth', value: counts.female.toLocaleString(), change: 'Gender Split', icon: Briefcase },
    { label: 'Barangays Covered', value: counts.brgyCount.toLocaleString(), change: 'Out of 55', icon: MapPin }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#7BA4D0]/20 p-8 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0D2440]">Dashboard</h2>
          <p className="text-sm text-[#7BA4D0]">Real-time account statistics</p>
        </div>
        <button className="bg-[#0D2440] hover:bg-[#2E5E99] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm">
          <Download size={18} /> <span className="font-medium">Export Data</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#2E5E99]" size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#7BA4D0]/10 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[#7BA4D0]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#0D2440] mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-[#E7F0FA] rounded-xl text-[#2E5E99]">
                    <stat.icon size={22} />
                  </div>
                </div>
                <p className="text-xs font-bold mt-4 text-[#2E5E99]">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="p-6 rounded-2xl border border-gray-100 lg:col-span-1">
              <h3 className="font-bold text-[#0D2440] mb-4">Recent Activity</h3>
              <div className="space-y-4 text-sm">
                {recentNames.length > 0 ? recentNames.map((act, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-[#0D2440] font-medium">
                        {act.barangays?.name || "No Barangay"}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${act.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {act.status}
                    </span>
                  </div>
                )) : (
                  <p className="text-gray-400 italic">No recent activity</p>
                )}
              </div>
            </div>

            {/* Pending SK Accounts - Displaying Barangay Name */}
            <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/10 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-amber-600" size={18} />
                <h3 className="font-bold text-[#0D2440]">Pending SK Accounts</h3>
              </div>
              <div className="space-y-3">
                {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-xl border border-amber-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-[#0D2440]">
                          {/* This shows the Barangay Name if found, otherwise the ID or 'Pending User' */}
                          {user.barangays?.name ? `Brgy: ${user.barangays.name}` : user.barangay_id ? `ID: ${user.barangay_id.substring(0,8)}` : "No Barangay Set"}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">{user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading === user.id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      >
                        {actionLoading === user.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={20} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={actionLoading === user.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                      <p className="text-xs text-gray-400 italic">No pending accounts found.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/30 lg:col-span-1">
              <h3 className="font-bold text-[#0D2440] mb-4">System Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="p-3 bg-white border border-[#d1e3f8] rounded-xl text-xs font-bold text-[#2E5E99] hover:shadow-sm">Add SK</button>
                 <button className="p-3 bg-white border border-[#d1e3f8] rounded-xl text-xs font-bold text-[#2E5E99] hover:shadow-sm">User Logs</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardView;