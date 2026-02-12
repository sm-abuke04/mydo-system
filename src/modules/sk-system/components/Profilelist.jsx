import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import { Users, FileText, Search, X, Edit, Trash2 } from 'lucide-react';

export default function ProfileList({ profiles, onDelete, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Debounce Search: Only search after user stops typing for 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Runs whenever searchTerm changes

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#7BA4D0]/20 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[#E7F0FA]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0D2440]">Youth Profiles Database</h2>
            <div className="flex items-center gap-2 text-[#2E5E99] mt-1">
              <FileText className="w-4 h-4" />
              <span className="font-semibold text-sm">
                {searchTerm ? `Search Results: ${profiles.length}` : `${profiles.length} Total Records`}
              </span>
            </div>
          </div>
          
          {/* Always show search bar now */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#7BA4D0]" />
            </div>
            <input 
              type="text" 
              placeholder="Search server..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-10 py-2.5 bg-[#E7F0FA] border border-transparent text-[#0D2440] text-sm rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2E5E99] focus:border-transparent transition-all placeholder-[#7BA4D0]" 
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7BA4D0] hover:text-[#2E5E99]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {profiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            {searchTerm ? (
              <>
                <Search className="w-12 h-12 text-[#7BA4D0] mb-3 opacity-50" />
                <p className="text-[#0D2440] font-semibold">No results found for "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-[#2E5E99] font-bold hover:underline">Clear Search</button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#E7F0FA] rounded-full flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-[#7BA4D0]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D2440] mb-2">No Profiles Yet</h3>
                <Link to="/add" className="px-6 py-3 bg-[#2E5E99] text-white font-bold rounded-xl hover:bg-[#0D2440] transition-all shadow-md active:scale-95">
                  Add First Profile
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#E7F0FA] sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#0D2440] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0D2440] uppercase tracking-wider">Age/Sex</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0D2440] uppercase tracking-wider">Barangay</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0D2440] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0D2440] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0FA]">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-[#E7F0FA]/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#0D2440]">{profile.firstName} {profile.lastName}</div>
                      <div className="text-xs text-[#7BA4D0]">ID: #{profile.respondentNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0D2440]">{profile.age} / {profile.sex}</td>
                    <td className="px-6 py-4 text-sm text-[#0D2440]">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7F0FA] text-[#2E5E99]">{profile.barangay}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7BA4D0]">{profile.youthClassification[0] || 'N/A'}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                       <button onClick={() => navigate(`/edit/${profile.id}`)} className="p-2 text-[#2E5E99] hover:bg-[#E7F0FA] rounded-lg transition-colors" title="Edit">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => onDelete(profile.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}