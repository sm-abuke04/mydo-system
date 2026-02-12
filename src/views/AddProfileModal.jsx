import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, Shield, User, Star, StarHalf, Save, UserPlus, Edit3, Camera } from 'lucide-react';

const AddProfileModal = ({ isOpen, onClose, mode, initialData, onSave }) => {
  const fileInputRef = useRef(null);

  // 1. STATE
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '', 
    lastName: '',
    suffix: '',    
    skmtNo: '',
    birthdate: '',
    gender: 'Male', 
    brgy: '',
    status: 'Active',
    image: ''       
  });

  // 2. SYNC DATA
  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setFormData(initialData);
    } else {
      setFormData({ 
        firstName: '', middleName: '', lastName: '', suffix: '', 
        skmtNo: '', birthdate: '', gender: 'Male', brgy: '', status: 'Active', image: '' 
      });
    }
  }, [initialData, isOpen, mode]);

  // 3. HANDLERS
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const triggerFileInput = () => {
    if (mode !== 'view') {
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  const isAdd = mode === 'add';
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  // Helper to construct Full Name for View Mode
  const fullName = `${formData.firstName} ${formData.middleName || ''} ${formData.lastName} ${formData.suffix || ''}`.replace(/\s+/g, ' ').trim();

  const categories = [
    { name: "CBYDP", status: true },
    { name: "ABYIP", status: false },
    { name: "BUDGET", status: true },
    { name: "KK PROFILE", status: false },
    { name: "DIRECTORY", status: true },
    { name: "UTILIZATION", status: false }
  ];

  // =========================================================
  // Grid: 
  // Full Name   | Birthdate
  // SKMT Number | Gender
  // Barangay    | Status
  // =========================================================
  const RenderViewInterface = () => (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      {/* Row 1 */}
      <ViewField label="FULL NAME" value={fullName} />
      <ViewField label="BIRTHDATE" value={formData.birthdate} />

      {/* Row 2 */}
      <ViewField label="SKMT NUMBER" value={formData.skmtNo} isHighlight />
      <ViewField label="GENDER" value={formData.gender} />

      {/* Row 3 */}
      <ViewField label="BARANGAY" value={formData.brgy || 'Airport Village'} />
      <div>
        <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1 tracking-wide transition-colors">STATUS</p>
        <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md text-[9px] font-black border border-emerald-100 dark:border-emerald-800/50 uppercase transition-colors">
          {formData.status || 'ACTIVE'}
        </span>
      </div>
    </div>
  );

  // =========================================================
  // LAYOUT 2: MODIFY / ADD DETAILS
  // =========================================================
  const RenderModifyInterface = () => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      
      {/* Row 1: First Name & Middle Name */}
      <EditField 
        label="First Name" 
        value={formData.firstName} 
        onChange={(v) => setFormData({...formData, firstName: v})} 
      />
      <EditField 
        label="Middle Name" 
        value={formData.middleName} 
        onChange={(v) => setFormData({...formData, middleName: v})} 
      />

      {/* Row 2: Last Name & Suffix */}
      <EditField 
        label="Last Name" 
        value={formData.lastName} 
        onChange={(v) => setFormData({...formData, lastName: v})} 
      />
      <EditField 
        label="Suffix (e.g. Jr.)" 
        value={formData.suffix} 
        onChange={(v) => setFormData({...formData, suffix: v})} 
      />
      
      {/* Divider */}
      {isAdd && <div className="col-span-2 h-px bg-gray-50 dark:bg-slate-700/50 my-2 transition-colors" />}

      {/* Row 3: SKMT & Birthdate */}
      <EditField 
        label="SKMT Number" 
        value={formData.skmtNo} 
        isHighlight 
        onChange={(v) => setFormData({...formData, skmtNo: v})} 
      />
      <EditField 
        label="Birthdate" 
        type="date" 
        value={formData.birthdate} 
        onChange={(v) => setFormData({...formData, birthdate: v})} 
      />

      {/* Row 4: Gender & Barangay */}
      <div>
        <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1 transition-colors">Gender</p>
        <select 
          className="w-full text-xs font-bold text-[#0D2440] dark:text-white bg-gray-50 dark:bg-slate-800 border-none rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          value={formData.gender}
          onChange={(e) => setFormData({...formData, gender: e.target.value})}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      
      <EditField 
        label="Barangay" 
        value={formData.brgy || (isAdd ? '' : 'Airport Village')} 
        onChange={(v) => setFormData({...formData, brgy: v})} 
      />
      
      {/* Row 5: Status */}
      <div className={isAdd ? "col-span-2" : ""}>
        <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1 transition-colors">Status</p>
        <select 
          className="w-full text-xs font-bold text-[#0D2440] dark:text-white bg-gray-50 dark:bg-slate-800 border-none rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  // =========================================================
  // MAIN RENDER
  // =========================================================
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#0D2440]/30 dark:bg-slate-900/80 backdrop-blur-sm transition-colors" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-4xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
        
        {/* Header */}
        <div className="px-8 py-5 flex justify-between items-center border-b border-gray-50 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
              isAdd ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : isEdit ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            }`}>
              {isAdd ? <UserPlus size={20} /> : isEdit ? <Edit3 size={20} /> : <Eye size={20} />}
            </div>
            <div>
              <h2 className="text-base font-black text-[#0D2440] dark:text-white leading-tight transition-colors">
                {isAdd ? 'Register New SK' : isEdit ? 'Modify Details' : 'SK Details'}
              </h2>
              <p className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isAdd ? 'text-emerald-400' : isEdit ? 'text-amber-400' : 'text-indigo-400'}`}>
                {isAdd ? 'Official Entry Terminal' : 'Identity Management'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          <div className="flex gap-10 items-start">
            
            {/* Left Column: Avatar (Shared) */}
            <div className="flex flex-col items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />

              <div 
                onClick={triggerFileInput}
                className={`w-32 h-32 rounded-4xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center group relative transition-colors ${!isView ? 'cursor-pointer' : ''}`}
              >
                {formData.image ? (
                  <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : isAdd ? (
                  <User size={40} className="text-gray-300 dark:text-slate-500 transition-colors" />
                ) : (
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                )}

                {!isView && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                    <Camera size={16} className="text-white mb-1" />
                    <span className="text-white text-[9px] font-black uppercase text-center leading-tight">Choose<br/>Profile</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] font-black text-gray-300 dark:text-slate-600 uppercase tracking-tighter transition-colors">
                  {isAdd ? 'Initial Rating' : 'Performance'}
                </p>
                <div className={`flex items-center gap-0.5 transition-colors ${isAdd ? 'text-gray-200 dark:text-slate-600' : 'text-amber-400'}`}>
                  {isAdd ? (
                     [1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-current" />)
                  ) : (
                    <>
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                      <Star size={12} className="fill-current" />
                      <StarHalf size={12} className="fill-current" />
                    </>
                  )}
                </div>
                <span className={`text-[11px] font-black mt-0.5 transition-colors ${isAdd ? 'text-gray-400 dark:text-slate-500' : 'text-amber-600 dark:text-amber-500'}`}>
                  {isAdd ? '0.0' : '4.5'}
                </span>
              </div>
            </div>

            {/* Right Column: SWAPS INTERFACE BASED ON MODE */}
            <div className="flex-1 space-y-6">
              {!isAdd && (
                <div className="flex items-center gap-2 opacity-30 dark:opacity-40">
                  <User size={12} className="dark:text-slate-300" />
                  <span className="text-[9px] font-black uppercase tracking-widest dark:text-slate-300 transition-colors">Registry Information</span>
                </div>
              )}
              
              {isView ? <RenderViewInterface /> : <RenderModifyInterface />}

            </div>
          </div>

          {/* Compliance Board */}
          {!isAdd && (
            <section className="bg-gray-50/50 dark:bg-slate-800/30 p-6 rounded-4xl border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                <h3 className="text-[10px] font-black text-[#0D2440] dark:text-white uppercase tracking-wider transition-colors">Compliance Monitoring Board</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-gray-50 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
                    <span className="text-[9px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-tight transition-colors">{item.name}</span>
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${item.status ? 'bg-emerald-500 dark:bg-emerald-400 shadow-emerald-100 dark:shadow-none' : 'bg-red-500 dark:bg-red-400 shadow-red-100 dark:shadow-none'}`} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        {/* Darkened the footer for both light/dark mode for consistent branding, but adjusted text colors for dark mode context */}
        <div className="px-8 py-4 bg-[#0D2440] dark:bg-slate-950 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-2 text-[8px] font-bold text-white/30 dark:text-slate-500 uppercase tracking-[0.2em]">
            <div className={`w-1.5 h-1.5 rounded-full ${isAdd ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
            <span>{isAdd ? 'Secure Registration Node' : 'Secure Data Terminal'}</span>
          </div>
          
          {!isView && (
            <button 
              onClick={() => onSave(formData)}
              className={`flex items-center gap-2 px-8 py-2.5 bg-white dark:bg-slate-800 text-[#0D2440] dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                isAdd ? 'hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400' : 'hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-400'
              }`}
            >
              <Save size={14} /> 
              {isAdd ? 'Register SK Member' : 'Save Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// HELPER 1: For View (Text Only)
const ViewField = ({ label, value, isHighlight }) => (
  <div className="min-w-0">
    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1 transition-colors">{label}</p>
    <p className={`text-xs font-bold truncate transition-colors ${isHighlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#0D2440] dark:text-white'}`}>
      {value || '---'}
    </p>
  </div>
);

// HELPER 2: For Edit (Input Fields)
const EditField = ({ label, value, onChange, type = "text", isHighlight }) => (
  <div className="min-w-0">
    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1 transition-colors">{label}</p>
    <input 
      type={type}
      placeholder={type === "date" ? "" : `Enter ${label}...`}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full text-xs font-bold bg-gray-50 dark:bg-slate-800 border-none rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${isHighlight ? 'text-indigo-600 dark:text-indigo-400 placeholder-indigo-300 dark:placeholder-indigo-800' : 'text-[#0D2440] dark:text-white placeholder-gray-300 dark:placeholder-slate-600'}`}
    />
  </div>
);

export default AddProfileModal;