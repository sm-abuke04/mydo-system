// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { Edit, Trash2, User, Search, MapPin, Loader2, RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';
// import AddProfileModal from './AddProfileModal';

// const ProfilesView = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [modalMode, setModalMode] = useState('add');

//   // FETCH FUNCTION
//   const fetchProfiles = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('youths')
//         .select(`
//           *,
//           barangays (name)
//         `)
//         .eq('role', 'SK') 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setProfiles(data || []);
//     } catch (error) {
//       alert('Error fetching data: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   // UPDATE STATUS (Approve)
//   const handleStatusUpdate = async (profileId, newStatus) => {
//     try {
//       const { error } = await supabase
//         .from('youths')
//         .update({ status: newStatus })
//         .eq('id', profileId);

//       if (error) throw error;
      
//       setProfiles(prev => prev.map(p => 
//         p.id === profileId ? { ...p, status: newStatus } : p
//       ));
//     } catch (error) {
//       alert('Failed to update status: ' + error.message);
//     }
//   };

//   // DELETE LOGIC (Now accessible for all accounts)
//   const handleDelete = async (profileId) => {
//     if (!window.confirm("Are you sure you want to permanently delete this account? This action cannot be undone.")) return;

//     try {
//       const { error } = await supabase
//         .from('youths')
//         .delete()
//         .eq('id', profileId);

//       if (error) throw error;
      
//       // Remove from local state immediately
//       setProfiles(prev => prev.filter(p => p.id !== profileId));
//     } catch (error) {
//       alert('Error deleting user: ' + error.message);
//     }
//   };

//   const handleEdit = (profile) => {
//     setSelectedProfile(profile);
//     setModalMode('edit');
//     setIsModalOpen(true);
//   };

//   const handleView = (profile) => {
//     setSelectedProfile(profile);
//     setModalMode('view');
//     setIsModalOpen(true);
//   };

//   const filteredProfiles = profiles.filter(p => 
//     `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.skmt_no?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">SK Member Registry</h1>
//           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manage and Delete Accounts</p>
//         </div>
        
//         <div className="flex gap-4">
//           <button onClick={fetchProfiles} className="p-3 bg-white rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all">
//             <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
//           </button>
          
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input 
//               type="text"
//               placeholder="Search SK Members..."
//               className="pl-10 pr-4 py-2 bg-white border-none rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button 
//             onClick={() => { setSelectedProfile(null); setModalMode('add'); setIsModalOpen(true); }}
//             className="bg-[#0D2440] text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
//           >
//             Add New SK
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-50/50 border-b border-gray-100">
//                 <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile</th>
//                 <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</th>
//                 <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Barangay</th>
//                 <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
//                 <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
//                     <Loader2 className="animate-spin mx-auto mb-2" size={32} /> Syncing Database...
//                   </td>
//                 </tr>
//               ) : filteredProfiles.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-20 text-center font-black text-gray-300 uppercase tracking-widest">No Records Found</td>
//                 </tr>
//               ) : (
//                 filteredProfiles.map((profile) => (
//                   <tr key={profile.id} className="hover:bg-indigo-50/30 transition-colors group">
//                     <td className="p-6">
//                       <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md">
//                         {profile.image_url ? (
//                           <img src={profile.image_url} className="w-full h-full object-cover" alt="" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={20} /></div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="p-6">
//                       <p className="text-sm font-black text-[#0D2440] uppercase tracking-tighter">
//                         {profile.last_name}, {profile.first_name}
//                       </p>
//                       <p className="text-[10px] text-gray-400 font-bold uppercase">{profile.skmt_no || 'No SKMT'}</p>
//                     </td>
//                     <td className="p-6 text-xs font-bold text-gray-600 uppercase">
//                       {profile.barangays?.name || 'Unassigned'}
//                     </td>
//                     <td className="p-6">
//                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
//                         profile.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
//                       }`}>
//                         {profile.status || 'PENDING'}
//                       </span>
//                     </td>
//                     <td className="p-6">
//                       <div className="flex justify-end gap-2 items-center">
//                         {/* PENDING SPECIFIC ACTIONS */}
//                         {profile.status === 'PENDING' && (
//                           <button 
//                             onClick={() => handleStatusUpdate(profile.id, 'Active')}
//                             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
//                             title="Approve"
//                           >
//                             <CheckCircle size={16} />
//                           </button>
//                         )}
                        
//                         {/* GENERAL ACTIONS */}
//                         <div className="flex gap-2">
//                           <button onClick={() => handleView(profile)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-white shadow-sm" title="View"><Eye size={14} /></button>
//                           <button onClick={() => handleEdit(profile)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all" title="Edit"><Edit size={14} /></button>
//                           <button 
//                             onClick={() => handleDelete(profile.id)} 
//                             className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
//                             title="Delete Permanently"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <AddProfileModal 
//         isOpen={isModalOpen} 
//         onClose={() => { setIsModalOpen(false); fetchProfiles(); }} 
//         mode={modalMode} 
//         initialData={selectedProfile} 
//       />
//     </div>
//   );
// };

// export default ProfilesView;

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Edit, Trash2, User, Search, MapPin, Loader2, RefreshCw, CheckCircle, Eye } from 'lucide-react';
import AddProfileModal from './AddProfileModal';

const ProfilesView = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      // We remove .order() entirely to prevent "column does not exist" errors
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          barangays (name)
        `)
        .eq('role', 'SK');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      alert('Database Sync Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleStatusUpdate = async (profileId, newStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', profileId);

      if (error) throw error;
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status: newStatus } : p));
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm("Are you sure? This is permanent.")) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', profileId);
      if (error) throw error;
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  // Safe filtering logic
  const filteredProfiles = profiles.filter(p => {
    const search = searchTerm.toLowerCase();
    const fName = (p.first_name || '').toLowerCase();
    const lName = (p.last_name || '').toLowerCase();
    const brgy = (p.barangays?.name || '').toLowerCase();
    return fName.includes(search) || lName.includes(search) || brgy.includes(search);
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">SK Member Registry</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Profiles Table View</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={fetchProfiles} className="p-3 bg-white rounded-xl shadow-sm hover:text-indigo-600 transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search SK..."
              className="pl-10 pr-4 py-2 bg-white border-none rounded-xl text-sm font-bold shadow-sm outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setSelectedProfile(null); setModalMode('add'); setIsModalOpen(true); }}
            className="bg-[#0D2440] text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
          >
            Add New SK
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Official</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Barangay</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-bold uppercase text-xs">Loading...</td></tr>
              ) : filteredProfiles.length === 0 ? (
                <tr><td colSpan="4" className="p-20 text-center text-gray-300 font-black uppercase">No Records</td></tr>
              ) : (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-white shadow-sm">
                          {profile.image_url ? <img src={profile.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={16} /></div>}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#0D2440] uppercase tracking-tighter">
                            {profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}` : 'Unknown Name'}
                          </p>
                          <p className="text-[10px] text-indigo-500 font-bold uppercase">{profile.position || 'SK Official'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase">
                        <MapPin size={12} className="text-amber-500" />
                        {profile.barangays?.name || 'No Barangay Set'}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${profile.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {profile.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        {profile.status === 'PENDING' && (
                          <button onClick={() => handleStatusUpdate(profile.id, 'APPROVED')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"><CheckCircle size={16} /></button>
                        )}
                        <button onClick={() => { setSelectedProfile(profile); setModalMode('view'); setIsModalOpen(true); }} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-white shadow-sm"><Eye size={14} /></button>
                        <button onClick={() => { setSelectedProfile(profile); setModalMode('edit'); setIsModalOpen(true); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(profile.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProfileModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchProfiles(); }} 
        mode={modalMode} 
        initialData={selectedProfile} 
      />
    </div>
  );
};

export default ProfilesView;