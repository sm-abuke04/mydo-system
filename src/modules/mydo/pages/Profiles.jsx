import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, UserPlus, Filter, Edit2, Eye, 
  Calendar, MoreHorizontal, ChevronLeft, MapPin, Users, Loader2 
} from 'lucide-react';
import AddProfileModal from '../components/AddProfileModal';
import { MydoService } from '../services/MYDOService'; // Import Service
import { BARANGAYS } from '../data/Barangays'; // Source of Truth for Barangays
import { supabase } from '@/lib/supabase';

const Profiles = () => {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('barangays');
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [barangays, setBarangays] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Filter State
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterRef = useRef(null);
  
  // Filters
  const [brgyCategoryFilter, setBrgyCategoryFilter] = useState('All');
  const [brgyStatusFilter, setBrgyStatusFilter] = useState('All');
  const [profileStatusFilter, setProfileStatusFilter] = useState('All');
  const [profileGenderFilter, setProfileGenderFilter] = useState('All');

  // --- DATA FETCHING ---

  // 1. Fetch Barangays and Merge with User Access Data
  useEffect(() => {
    const loadBarangays = async () => {
      try {
        setIsLoading(true);
        // Fetch active SK Chairs to determine status and chairman name
        const { data: skUsers, error } = await supabase
            .from('users')
            .select('first_name, last_name, barangay, role, status')
            .eq('status', 'Active')
            .in('role', ['SK_CHAIR', 'SK_SEC']); // Assuming Chair or Sec grants access

        if (error) throw error;

        // Map static BARANGAYS list to dynamic data
        const mergedBarangays = BARANGAYS.map(staticBrgy => {
            const activeSK = skUsers?.find(u => u.barangay === staticBrgy.name);
            return {
                ...staticBrgy,
                status: activeSK ? 'Active' : 'No Access',
                chairman: activeSK ? `${activeSK.first_name} ${activeSK.last_name}` : '---',
                total_youth: 0 // Ideally fetch this count separately if needed
            };
        });

        setBarangays(mergedBarangays);
      } catch (err) {
        console.error("Failed to load barangays", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBarangays();
  }, []);

  // 2. Fetch Profiles when filters change
  useEffect(() => {
    if (currentView === 'profiles') {
      const loadProfiles = async () => {
        setIsLoading(true);
        try {
          // Pass all active filters to the service
          const { data } = await MydoService.getProfiles({
            barangay: selectedBarangay?.name, // Only get profiles for this barangay
            search: searchTerm,
            status: profileStatusFilter,
            gender: profileGenderFilter
          });
          setProfiles(data || []);
        } catch (err) {
          console.error("Failed to load profiles", err);
        } finally {
          setIsLoading(false);
        }
      };
      // Debounce search could be added here
      const timer = setTimeout(() => { loadProfiles(); }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentView, selectedBarangay, searchTerm, profileStatusFilter, profileGenderFilter]);

  // --- FILTERING BARANGAYS (Client-side is fine for < 100 items) ---
  const filteredBarangays = barangays.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.chairman || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = brgyCategoryFilter === 'All' || b.category === brgyCategoryFilter;
    const matchesStatus = brgyStatusFilter === 'All' || b.status === brgyStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // --- HANDLERS ---
  const handleViewBarangay = (barangay) => {
    if (barangay.status !== 'Active') {
        alert("This barangay does not have an active SK account.");
        return;
    }
    setSelectedBarangay(barangay);
    setCurrentView('profiles');
    setSearchTerm(''); // Reset search when entering a barangay
    setProfileStatusFilter('All');
    setProfileGenderFilter('All');
  };

  const handleBackToBarangays = () => {
    setCurrentView('barangays');
    setSelectedBarangay(null);
    setSearchTerm('');
    setProfiles([]); // Clear profiles to avoid flash of old data
  };

  const handleSaveProfile = async (formData) => {
    try {
      if (formData.id) {
        await MydoService.updateProfile(formData.id, formData);
      } else {
        await MydoService.createProfile({
            ...formData,
            barangay: selectedBarangay.name // Ensure it links to current barangay
        });
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to save profile");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 h-full shadow-sm flex flex-col transition-colors duration-300">
      
      {/* HEADER & FILTERS */}
      <div className="flex justify-between items-start mb-8 shrink-0">
         <div>
          {currentView === 'barangays' ? (
            <>
              <h1 className="text-2xl font-black text-[#0D2440] dark:text-white">Barangay Directory</h1>
              <p className="text-sm text-[#7BA4D0] dark:text-slate-400">Select a barangay to view its SK Profiles</p>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={handleBackToBarangays} className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-500 hover:bg-gray-100 rounded-xl">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-[#0D2440] dark:text-white">Brgy. {selectedBarangay?.name}</h1>
                <p className="text-sm text-[#7BA4D0] uppercase tracking-widest font-bold text-[10px]">Youth Registry</p>
              </div>
            </div>
          )}
        </div>

         <div className="flex gap-3">
            <div className="relative">
                <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className="flex items-center gap-2 px-4 py-2 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-500 dark:text-slate-300">
                    <Filter size={18} /> Filter
                </button>
            </div>
            {/* ADD PROFILE BUTTON */}
            {currentView === 'profiles' && (
                <button onClick={() => { setModalMode('add'); setSelectedProfile(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-[#0D2440] dark:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg">
                <UserPlus size={18} /> Add Profile
                </button>
            )}
         </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6 shrink-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder={currentView === 'barangays' ? "Search barangay..." : "Search youth..."}
          className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-[#0D2440] dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* DATA TABLE AREA */}
      <div className="flex-1 overflow-auto pr-2 relative">
        {isLoading && currentView === 'barangays' && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-20 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        )}

        {currentView === 'barangays' ? (
          <table className="w-full text-left">
             <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-slate-800">
                    <th className="pb-4 px-4">Barangay</th>
                    <th className="pb-4 px-4">SK Official</th>
                    <th className="pb-4 px-4 text-center">Total Youth</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 px-4 text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {filteredBarangays.map((brgy) => (
                    <tr key={brgy.id} className="group hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={18} /></div>
                                <div>
                                    <p className="text-sm font-black text-[#0D2440] dark:text-white">{brgy.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{brgy.category}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-700 dark:text-slate-300">{brgy.chairman}</td>
                        <td className="py-4 px-4 text-center">
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm font-black text-[#0D2440] dark:text-white">
                                <Users size={14} className="text-blue-500" /> {brgy.total_youth || 0}
                             </div>
                        </td>
                        <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${brgy.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{brgy.status}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                            <button
                                onClick={() => handleViewBarangay(brgy)}
                                disabled={brgy.status !== 'Active'}
                                className={`px-4 py-2 text-xs font-bold border rounded-xl transition-colors ${brgy.status === 'Active' ? 'border-gray-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-pointer' : 'border-transparent text-gray-300 cursor-not-allowed'}`}
                            >
                                {brgy.status === 'Active' ? 'View Profiles' : 'No Access'}
                            </button>
                        </td>
                    </tr>
                ))}
             </tbody>
          </table>
        ) : (
          /* PROFILES TABLE */
          <table className="w-full text-left">
             <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-slate-800">
                    <th className="pb-4 px-4">SKMT No.</th>
                    <th className="pb-4 px-4">Name</th>
                    <th className="pb-4 px-4">Position</th>
                    <th className="pb-4 px-4">Birthdate</th>
                    <th className="pb-4 px-4">Gender</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 px-4 text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {profiles.length > 0 ? (
                    profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-4 text-sm font-bold text-blue-400">{profile.skmt_no}</td>
                            <td className="py-4 px-4 text-sm font-black text-[#0D2440] dark:text-white">{profile.first_name} {profile.last_name}</td>
                            <td className="py-4 px-4 text-xs font-bold uppercase text-gray-500">{profile.position || 'Member'}</td>
                            <td className="py-4 px-4 text-sm text-gray-500 flex items-center gap-2"><Calendar size={14}/> {profile.birthdate}</td>
                            <td className="py-4 px-4 text-sm text-gray-500">{profile.gender}</td>
                            <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${profile.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50'}`}>{profile.status}</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <button onClick={() => { setModalMode('edit'); setSelectedProfile(profile); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600">
                                    <Edit2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="7" className="py-10 text-center text-gray-400">No profiles found for {selectedBarangay?.name}.</td></tr>
                )}
             </tbody>
          </table>
        )}
      </div>

      <AddProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode} 
        initialData={selectedProfile}
        onSave={handleSaveProfile} 
      />
    </div>
  );
};

export default Profiles;