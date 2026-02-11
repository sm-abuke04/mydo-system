import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, UserPlus, Filter, Edit2, Eye, 
  Calendar, MoreHorizontal, ChevronLeft, MapPin, Users 
} from 'lucide-react';
import AddProfileModal from './AddProfileModal';

const ProfilesView = () => {
  // --- NAVIGATION STATE ---
  const [currentView, setCurrentView] = useState('barangays');
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  // --- UI STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProfile, setSelectedProfile] = useState(null);

  // --- FILTER STATE ---
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterRef = useRef(null);
  
  // Barangay Filters
  const [brgyCategoryFilter, setBrgyCategoryFilter] = useState('All');
  const [brgyStatusFilter, setBrgyStatusFilter] = useState('All');
  
  // Profile Filters
  const [profileStatusFilter, setProfileStatusFilter] = useState('All');
  const [profileGenderFilter, setProfileGenderFilter] = useState('All');

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- MOCK DATA: BARANGAYS ---
  const barangays = [
    { id: 1, name: 'Old Rizal', category: 'Rural', chairman: 'Hon. Maria Clara', totalYouth: 145, status: 'Active' },
    { id: 2, name: 'Dalakit', category: 'Poblacion', chairman: 'Hon. Jose Rizal', totalYouth: 312, status: 'Active' },
    { id: 3, name: 'UEP Zone 1', category: 'University', chairman: 'Hon. Apolinario Mabini', totalYouth: 250, status: 'Active' },
    { id: 4, name: 'Baybay', category: 'Coastal', chairman: 'Hon. Andres Bonifacio', totalYouth: 198, status: 'Inactive' },
  ];

  // --- MOCK DATA: PROFILES ---
  const [profiles, setProfiles] = useState([
    { id: 1, barangay: 'Old Rizal', skmtNo: '2026-001', firstName: 'Juan', lastName: 'dela Cruz', position: 'SK Chairperson', birthdate: '2004-05-12', age: 22, gender: 'Male', status: 'Active' },
    { id: 2, barangay: 'Old Rizal', skmtNo: '2026-002', firstName: 'Ana', lastName: 'Reyes', position: 'Secretary', birthdate: '2005-08-21', age: 20, gender: 'Female', status: 'Active' },
    { id: 3, barangay: 'Dalakit', skmtNo: '2026-003', firstName: 'Maria', lastName: 'Garcia', position: 'SK Chairperson', birthdate: '2007-02-20', age: 19, gender: 'Female', status: 'Active' },
    { id: 4, barangay: 'UEP Zone 1', skmtNo: '2026-004', firstName: 'Pedro', lastName: 'Santos', position: 'Treasurer', birthdate: '2001-11-30', age: 25, gender: 'Male', status: 'Inactive' },
    { id: 5, barangay: 'Old Rizal', skmtNo: '2026-005', firstName: 'Jose', lastName: 'Batumbakal', position: 'Kagawad', birthdate: '2003-01-15', age: 23, gender: 'Male', status: 'Resigned' },
  ]);

  // --- FILTERING LOGIC ---
  const filteredBarangays = barangays.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.chairman.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = brgyCategoryFilter === 'All' || b.category === brgyCategoryFilter;
    const matchesStatus = brgyStatusFilter === 'All' || b.status === brgyStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredProfiles = profiles.filter(p => {
    const inBarangay = p.barangay === selectedBarangay?.name;
    const matchesSearch = (`${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || p.skmtNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = profileStatusFilter === 'All' || p.status === profileStatusFilter;
    const matchesGender = profileGenderFilter === 'All' || p.gender === profileGenderFilter;
    return inBarangay && matchesSearch && matchesStatus && matchesGender;
  });

  // --- HANDLERS ---
  const handleViewBarangay = (barangay) => {
    setSelectedBarangay(barangay);
    setCurrentView('profiles');
    setSearchTerm('');
    setProfileStatusFilter('All');
    setProfileGenderFilter('All');
    setIsFilterMenuOpen(false);
  };

  const handleBackToBarangays = () => {
    setCurrentView('barangays');
    setSelectedBarangay(null);
    setSearchTerm('');
    setBrgyCategoryFilter('All');
    setBrgyStatusFilter('All');
    setIsFilterMenuOpen(false);
  };

  const handleAction = (mode, profile = null) => {
    setModalMode(mode);
    setSelectedProfile(profile);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  return (
    // MAIN CONTAINER (Added dark mode classes)
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 h-full shadow-sm flex flex-col transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-8 shrink-0">
        <div>
          {currentView === 'barangays' ? (
            <>
              <h1 className="text-2xl font-black text-[#0D2440] dark:text-white transition-colors">Barangay Directory</h1>
              <p className="text-sm text-[#7BA4D0] dark:text-slate-400 transition-colors">Select a barangay to view its SK Profiles</p>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBackToBarangays}
                className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-[#0D2440] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-[#0D2440] dark:text-white transition-colors">Brgy. {selectedBarangay?.name}</h1>
                <p className="text-sm text-[#7BA4D0] dark:text-slate-400 uppercase tracking-widest font-bold text-[10px] transition-colors">Youth Registry</p>
              </div>
            </div>
          )}
        </div>

        {/* --- DYNAMIC ACTIONS & FILTER BUTTON --- */}
        <div className="flex gap-3">
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-100 dark:border-slate-700 rounded-xl text-[#7BA4D0] dark:text-slate-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
            >
              <Filter size={18} /> Filter
            </button>

            {/* FILTER DROPDOWN MENU */}
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {currentView === 'barangays' ? (
                  // BARANGAY FILTERS
                  <>
                    <div className="mb-4">
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-2 block">District Category</label>
                      <select 
                        value={brgyCategoryFilter}
                        onChange={(e) => setBrgyCategoryFilter(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
                      >
                        <option value="All">All Categories</option>
                        <option value="Rural">Rural</option>
                        <option value="Poblacion">Poblacion</option>
                        <option value="University">University</option>
                        <option value="Coastal">Coastal</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                      <select 
                        value={brgyStatusFilter}
                        onChange={(e) => setBrgyStatusFilter(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                ) : (
                  // PROFILE FILTERS
                  <>
                    <div className="mb-4">
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-2 block">Account Status</label>
                      <select 
                        value={profileStatusFilter}
                        onChange={(e) => setProfileStatusFilter(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Resigned">Resigned</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-2 block">Gender</label>
                      <select 
                        value={profileGenderFilter}
                        onChange={(e) => setProfileGenderFilter(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
                      >
                        <option value="All">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </>
                )}
                
              </div>
            )}
          </div>

          {/* Only show Add Profile if we are inside a Barangay view */}
          {currentView === 'profiles' && (
            <button 
              onClick={() => handleAction('add')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0D2440] dark:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-[#0D2440]/20 dark:shadow-none hover:bg-[#1a3b5e] dark:hover:bg-blue-700 transition-all"
            >
              <UserPlus size={18} /> Add Profile
            </button>
          )}
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative mb-6 shrink-0 animate-in fade-in duration-300">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA4D0] dark:text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={currentView === 'barangays' ? "Search barangay or chairman..." : "Search by SKMT No. or Name..."}
          className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-[#0D2440] dark:text-white font-medium placeholder-[#7BA4D0]/60 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- DYNAMIC TABLE AREA --- */}
      <div className="flex-1 overflow-auto pr-2">
        
        {/* VIEW 1: BARANGAY LIST */}
        {currentView === 'barangays' && (
          <table className="w-full text-left animate-in slide-in-from-right-4 duration-300">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7BA4D0] dark:text-slate-400 border-b border-gray-100 dark:border-slate-800">
                <th className="pb-4 px-4">Barangay</th>
                <th className="pb-4 px-4">SK Chairman</th>
                <th className="pb-4 px-4 text-center">Total Youth</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {filteredBarangays.map((brgy) => (
                <tr key={brgy.id} className="group hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-all cursor-pointer" onClick={() => handleViewBarangay(brgy)}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0D2440] dark:text-white transition-colors">{brgy.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{brgy.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-700 dark:text-slate-300 transition-colors">{brgy.chairman}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-black text-[#0D2440] dark:text-white bg-gray-50 dark:bg-slate-800 py-1 px-3 rounded-lg w-fit mx-auto group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <Users size={14} className="text-blue-500 dark:text-blue-400" />
                      {brgy.totalYouth}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        brgy.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700'
                      }`}>
                      {brgy.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleViewBarangay(brgy); }}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#0D2440] dark:text-white text-xs font-bold rounded-xl group-hover:border-blue-200 dark:group-hover:border-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-all"
                    >
                      View Profiles
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBarangays.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-sm font-bold text-gray-400 dark:text-slate-500">
                    No barangays match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* VIEW 2: PROFILES LIST */}
        {currentView === 'profiles' && (
          <table className="w-full text-left animate-in slide-in-from-right-8 duration-300">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7BA4D0] dark:text-slate-400 border-b border-gray-100 dark:border-slate-800">
                <th className="pb-4 px-4">SKMT No.</th>
                <th className="pb-4 px-4">Name</th>
                <th className="pb-4 px-4">Position</th>
                <th className="pb-4 px-4">Birthdate</th>
                <th className="pb-4 px-4 text-center">Age</th>
                <th className="pb-4 px-4">Gender</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="group hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-all">
                    <td className="py-5 px-4 text-sm font-bold text-[#7BA4D0] dark:text-blue-400">{profile.skmtNo}</td>
                    <td className="py-5 px-4 text-sm font-black text-[#0D2440] dark:text-white">{profile.firstName} {profile.lastName}</td>
                    <td className="py-5 px-4 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">{profile.position}</td>
                    <td className="py-5 px-4 text-sm text-[#7BA4D0] dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-2"><Calendar size={14} className="opacity-40" /> {profile.birthdate}</div>
                    </td>
                    <td className="py-5 px-4 text-sm font-black text-[#0D2440] dark:text-white text-center">{profile.age}</td>
                    <td className="py-5 px-4 text-sm text-[#7BA4D0] dark:text-slate-400 font-medium">{profile.gender}</td>
                    <td className="py-5 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        profile.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' :
                        profile.status === 'Resigned' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50' : 
                        'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700'
                      }`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === profile.id ? null : profile.id)}
                        className="p-2 text-[#7BA4D0] dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white rounded-lg transition-all"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* Universal Action Dropdown */}
                      {openMenuId === profile.id && (
                        <div ref={menuRef} className="absolute right-4 mt-2 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 z-50 py-2 animate-in fade-in zoom-in duration-200">
                          <button 
                            onClick={() => handleAction('view', profile)}
                            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest text-[#7BA4D0] dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button 
                            onClick={() => handleAction('edit', profile)}
                            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest text-[#7BA4D0] dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm font-bold text-gray-400 dark:text-slate-500">
                    No youth profiles match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

      </div>

      {/* --- Add/Edit Profile Modal --- */}
      <AddProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        initialData={selectedProfile}
        onSave={(data) => {
          console.log("Saving profile:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProfilesView;