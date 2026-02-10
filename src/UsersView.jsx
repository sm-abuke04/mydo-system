import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  User, MapPin, Phone, Mail, 
  Search, Trash2, ShieldCheck, 
  Loader2, Filter, MoreVertical 
} from 'lucide-react';

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch only Active users who are SK officials
    const { data, error } = await supabase
      .from('youths')
      .select(`
        *,
        barangays (name)
      `)
      .eq('status', 'Active')
      .eq('role', 'SK')
      .order('last_name', { ascending: true });

    if (error) console.error("Error fetching users:", error);
    else setUsers(data || []);
    setLoading(false);
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName}? This will delete their account access.`)) return;
    
    setDeleteLoading(userId);
    try {
      // 1. Delete from the 'youths' table
      const { error: dbError } = await supabase
        .from('youths')
        .delete()
        .eq('id', userId);

      if (dbError) throw dbError;

      // 2. Remove from the local UI list
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert("User successfully removed.");
    } catch (err) {
      alert("Error deleting user: " + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter users based on search term (name, username, or barangay)
  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.barangays?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">SK Directory</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage active SK Officials and accounts</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text"
            placeholder="Search name, username, or barangay..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-[#0D2440] mb-2" size={32} />
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Syncing Directory...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-gray-50">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Name</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Barangay & Position</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0D2440] uppercase">{user.first_name} {user.last_name}</p>
                        <p className="text-[10px] font-bold text-gray-400">{user.phone_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="bg-[#F3F7FF] text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tight">
                      @{user.username}
                    </span>
                  </td>
                  <td className="p-6">
                    <div>
                      <p className="text-xs font-black text-[#0D2440] uppercase">{user.barangays?.name}</p>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{user.position}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => deleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                        disabled={deleteLoading === user.id}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete User"
                      >
                        {deleteLoading === user.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">No officials found matching that search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersView;