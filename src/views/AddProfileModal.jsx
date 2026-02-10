// import React, { useState, useEffect, useRef } from 'react';
// import { X, User, Save, UserPlus, Camera, Loader2, Search, Mail, Lock, Phone, MapPin, ShieldCheck } from 'lucide-react';
// import { supabase } from '../supabaseClient';

// const EditField = ({ label, value, onChange, type = "text", placeholder, icon: Icon, disabled = false }) => (
//   <div className="min-w-0">
//     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
//     <div className="relative">
//       {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />}
//       <input 
//         type={type}
//         disabled={disabled}
//         placeholder={placeholder || `Enter ${label}...`}
//         value={value || ''}
//         onChange={(e) => onChange(e.target.value)}
//         className={`w-full text-xs font-bold bg-gray-50 border-2 border-transparent rounded-xl p-3 outline-none focus:border-indigo-500/20 focus:bg-white transition-all text-[#0D2440] ${Icon ? 'pl-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//       />
//     </div>
//   </div>
// );

// const AddProfileModal = ({ isOpen, onClose, mode, initialData }) => {
//   const fileInputRef = useRef(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [barangayList, setBarangayList] = useState([]);
//   const [takenBarangays, setTakenBarangays] = useState([]);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [brgySearch, setBrgySearch] = useState('');
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     suffix: '',    
//     skmtNo: '',
//     birthdate: '',
//     gender: 'Male', 
//     barangay_id: '',
//     phone_number: '',
//     complete_address: '',
//     position: 'SK Member',
//     status: 'PENDING', 
//     image_url: ''       
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: brgys } = await supabase.from('barangays').select('id, name').order('name');
//       setBarangayList(brgys || []);

//       const { data: taken } = await supabase
//         .from('youths')
//         .select('barangay_id')
//         .in('status', ['Active', 'PENDING']);
      
//       const takenIds = taken?.map(t => t.barangay_id).filter(id => id !== initialData?.barangay_id) || [];
//       setTakenBarangays(takenIds);
//     };

//     if (isOpen) {
//       fetchData();
//       if (initialData && (mode === 'edit' || mode === 'view')) {
//         setFormData({
//           id: initialData.id,
//           email: initialData.email || '',
//           firstName: initialData.first_name || '',
//           middleName: initialData.middle_name || '',
//           lastName: initialData.last_name || '',
//           suffix: initialData.extension_name || '',
//           skmtNo: initialData.skmt_no || '',
//           birthdate: initialData.birth_date || '',
//           gender: initialData.gender || 'Male',
//           barangay_id: initialData.barangay_id || '',
//           phone_number: initialData.phone_number || '',
//           complete_address: initialData.complete_address || '',
//           position: initialData.position || 'SK Member',
//           status: initialData.status || 'Active',
//           image_url: initialData.image_url || ''
//         });
//         setImagePreview(initialData.image_url);
//       } else {
//         setFormData({ 
//           email: '', password: '', firstName: '', middleName: '', lastName: '', suffix: '', 
//           skmtNo: '', birthdate: '', gender: 'Male', barangay_id: '', 
//           phone_number: '', complete_address: '', position: 'SK Member',
//           status: 'PENDING', image_url: '' 
//         });
//         setImagePreview(null);
//         setImageFile(null);
//       }
//     }
//   }, [isOpen, initialData, mode]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const uploadImage = async (file) => {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Date.now()}.${fileExt}`;
//     const filePath = `profiles/${fileName}`;
//     const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
//     if (uploadError) throw uploadError;
//     const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
//     return data.publicUrl;
//   };

//   const handleSave = async () => {
//     if (!formData.firstName || !formData.lastName || !formData.barangay_id || !formData.email || (mode === 'add' && !formData.password)) {
//       alert("Please fill in all required fields, including Email and Password for login.");
//       return;
//     }

//     try {
//       setIsSaving(true);
//       let finalImageUrl = formData.image_url;
//       if (imageFile) finalImageUrl = await uploadImage(imageFile);

//       let userId = formData.id;

//       // AUTH CREATION (Only for new SK accounts)
//       if (mode === 'add') {
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: formData.email,
//           password: formData.password,
//           options: {
//             data: {
//               first_name: formData.firstName,
//               role: 'SK'
//             }
//           }
//         });
//         if (authError) throw authError;
//         userId = authData.user.id;
//       }

//       const payload = {
//         id: userId,
//         first_name: formData.firstName,
//         middle_name: formData.middleName,
//         last_name: formData.lastName,
//         extension_name: formData.suffix,
//         skmt_no: formData.skmtNo,
//         birth_date: formData.birthdate,
//         gender: formData.gender,
//         barangay_id: formData.barangay_id,
//         phone_number: formData.phone_number,
//         complete_address: formData.complete_address,
//         position: formData.position,
//         status: formData.status,
//         image_url: finalImageUrl,
//         role: 'SK',
//         email: formData.email
//       };

//       const { error } = mode === 'add' 
//         ? await supabase.from('youths').insert([payload])
//         : await supabase.from('youths').update(payload).eq('id', userId);

//       if (error) throw error;
      
//       alert(mode === 'add' ? "SK Account Created! They can now login with the credentials provided." : "Profile updated!");
//       onClose();
//     } catch (err) {
//       console.error("SAVE ERROR:", err);
//       alert("Error: " + err.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (!isOpen) return null;

//   const filteredBrgy = barangayList.filter(b => b.name.toLowerCase().includes(brgySearch.toLowerCase()));

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-[#0D2440]/40 backdrop-blur-md" onClick={onClose} />
//       <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
//         <div className="px-10 py-6 border-b flex justify-between items-center bg-gray-50/50">
//             <h2 className="text-xl font-black text-[#0D2440] uppercase tracking-tighter flex items-center gap-3">
//                 <UserPlus className="text-indigo-600" /> {mode === 'add' ? 'Setup New SK Login' : 'Update SK Account'}
//             </h2>
//             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
//         </div>

//         <div className="p-10 overflow-y-auto flex-1 space-y-8">
//           {/* LOGIN CREDENTIALS BLOCK */}
//           {mode === 'add' && (
//             <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 space-y-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="p-2 bg-indigo-600 rounded-lg text-white"><ShieldCheck size={16}/></div>
//                 <div>
//                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Account Security</p>
//                   <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1">These will be the SK member's login details</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <EditField label="Official SK Email" icon={Mail} value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="sk.member@catarman.com" />
//                 <EditField label="Temporary Password" icon={Lock} type="password" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} placeholder="Set a strong password" />
//               </div>
//             </div>
//           )}

//           <div className="flex flex-col md:flex-row gap-10">
//             {/* LEFT: PHOTO & POSITION */}
//             <div className="flex flex-col items-center gap-6">
//               <div onClick={() => fileInputRef.current.click()} className="w-44 h-44 rounded-[3rem] overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center relative cursor-pointer group transition-all hover:scale-105">
//                 {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <User size={48} className="text-gray-200" />}
//                 <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={32} /></div>
//               </div>
//               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              
//               <div className="w-full">
//                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Official Position</p>
//                 <select className="w-full text-xs font-bold bg-gray-100 text-[#0D2440] rounded-xl p-3 outline-none border-2 border-transparent focus:border-indigo-200" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})}>
//                   <option>SK Chairman</option>
//                   <option>SK Kagawad</option>
//                   <option>SK Secretary</option>
//                   <option>SK Treasurer</option>
//                   <option>SK Member</option>
//                 </select>
//               </div>
//             </div>

//             {/* RIGHT: PERSONAL DETAILS */}
//             <div className="flex-1 space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <EditField label="First Name" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
//                 <EditField label="Last Name" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
//                 <EditField label="Contact Number" icon={Phone} value={formData.phone_number} onChange={(v) => setFormData({...formData, phone_number: v})} placeholder="0912..." />
//                 <EditField label="Birthdate" type="date" value={formData.birthdate} onChange={(v) => setFormData({...formData, birthdate: v})} />
//               </div>

//               <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-3">
//                 <div className="flex justify-between items-center">
//                   <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><MapPin size={12}/> Assigned Barangay</p>
//                   <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border text-[10px] font-bold">
//                     <Search size={12} />
//                     <input placeholder="Filter..." className="outline-none w-16" value={brgySearch} onChange={(e) => setBrgySearch(e.target.value)} />
//                   </div>
//                 </div>
//                 <select className="w-full text-xs font-bold bg-white rounded-xl p-3 shadow-sm outline-none cursor-pointer" value={formData.barangay_id} onChange={(e) => setFormData({...formData, barangay_id: e.target.value})}>
//                   <option value="">-- Select Barangay --</option>
//                   {filteredBrgy.map(b => {
//                     const isTaken = takenBarangays.includes(b.id);
//                     return (
//                       <option key={b.id} value={b.id} disabled={isTaken} className={isTaken ? "text-gray-300" : ""}>
//                         {b.name} {isTaken ? "— (RESERVED)" : ""}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>

//               <div className="space-y-1">
//                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Complete Home Address</p>
//                 <textarea 
//                   value={formData.complete_address}
//                   onChange={(e) => setFormData({...formData, complete_address: e.target.value})}
//                   className="w-full text-xs font-bold bg-gray-50 border-2 border-transparent rounded-xl p-3 h-20 outline-none focus:border-indigo-500/20 focus:bg-white transition-all text-[#0D2440]"
//                   placeholder="Street, Phase, Landmark..."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="px-10 py-6 bg-gray-50 flex justify-end items-center border-t">
//           <button disabled={isSaving} onClick={handleSave} className="flex items-center gap-3 px-12 py-4 bg-[#0D2440] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-xl disabled:opacity-50 transition-all">
//             {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
//             {isSaving ? 'Creating Account...' : mode === 'add' ? 'Create SK Account' : 'Save Changes'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProfileModal;

import React, { useState, useEffect, useRef } from 'react';
import { X, User, Save, UserPlus, Camera, Loader2, Search, Mail, Lock, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

const EditField = ({ label, value, onChange, type = "text", placeholder, icon: Icon, disabled = false }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />}
      <input 
        type={type}
        disabled={disabled}
        placeholder={placeholder || `Enter ${label}...`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-xs font-bold bg-gray-50 border-2 border-transparent rounded-xl p-3 outline-none focus:border-indigo-500/20 focus:bg-white transition-all text-[#0D2440] ${Icon ? 'pl-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  </div>
);

const AddProfileModal = ({ isOpen, onClose, mode, initialData }) => {
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [barangayList, setBarangayList] = useState([]);
  const [takenBarangays, setTakenBarangays] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [brgySearch, setBrgySearch] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',    
    skmtNo: '',
    birthdate: '',
    gender: 'Male', 
    barangay_id: '',
    phone_number: '',
    complete_address: '',
    position: 'SK Member',
    status: 'PENDING', 
    image_url: ''       
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: brgys } = await supabase.from('barangays').select('id, name').order('name');
      setBarangayList(brgys || []);

      // We now check 'profiles' table for taken barangays to keep logic consistent
      const { data: taken } = await supabase
        .from('profiles')
        .select('barangay_id')
        .in('status', ['APPROVED', 'PENDING']);
      
      const takenIds = taken?.map(t => t.barangay_id).filter(id => id !== initialData?.barangay_id) || [];
      setTakenBarangays(takenIds);
    };

    if (isOpen) {
      fetchData();
      if (initialData && (mode === 'edit' || mode === 'view')) {
        setFormData({
          id: initialData.id,
          email: initialData.email || '',
          firstName: initialData.first_name || '',
          middleName: initialData.middle_name || '',
          lastName: initialData.last_name || '',
          suffix: initialData.extension_name || '',
          skmtNo: initialData.skmt_no || '',
          birthdate: initialData.birth_date || '',
          gender: initialData.gender || 'Male',
          barangay_id: initialData.barangay_id || '',
          phone_number: initialData.phone_number || '',
          complete_address: initialData.complete_address || '',
          position: initialData.position || 'SK Member',
          status: initialData.status || 'APPROVED',
          image_url: initialData.image_url || ''
        });
        setImagePreview(initialData.image_url);
      } else {
        setFormData({ 
          email: '', password: '', firstName: '', middleName: '', lastName: '', suffix: '', 
          skmtNo: '', birthdate: '', gender: 'Male', barangay_id: '', 
          phone_number: '', complete_address: '', position: 'SK Member',
          status: 'PENDING', image_url: '' 
        });
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, initialData, mode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.barangay_id || !formData.email || (mode === 'add' && !formData.password)) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setIsSaving(true);
      let finalImageUrl = formData.image_url;
      if (imageFile) finalImageUrl = await uploadImage(imageFile);

      let userId = formData.id;

      // 1. AUTH CREATION (Only for new SK accounts)
      if (mode === 'add') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              role: 'SK'
            }
          }
        });
        if (authError) throw authError;
        userId = authData.user.id;
      }

      // 2. PREPARE PAYLOAD
      const payload = {
        id: userId,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        extension_name: formData.suffix,
        skmt_no: formData.skmtNo,
        birth_date: formData.birthdate,
        gender: formData.gender,
        barangay_id: formData.barangay_id,
        phone_number: formData.phone_number,
        complete_address: formData.complete_address,
        position: formData.position,
        status: formData.status, // Will be 'PENDING' for new accounts
        image_url: finalImageUrl,
        role: 'SK',
        email: formData.email
      };

      // 3. TARGET THE 'profiles' TABLE (Fixing the mismatch)
      const { error } = mode === 'add' 
        ? await supabase.from('profiles').insert([payload])
        : await supabase.from('profiles').update(payload).eq('id', userId);

      if (error) throw error;
      
      alert(mode === 'add' ? "SK Account Created! Check Dashboard for approval." : "Profile updated!");
      onClose();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const filteredBrgy = barangayList.filter(b => b.name.toLowerCase().includes(brgySearch.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0D2440]/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="px-10 py-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-black text-[#0D2440] uppercase tracking-tighter flex items-center gap-3">
                <UserPlus className="text-indigo-600" /> {mode === 'add' ? 'Setup New SK Login' : 'Update SK Account'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <div className="p-10 overflow-y-auto flex-1 space-y-8">
          {mode === 'add' && (
            <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-600 rounded-lg text-white"><ShieldCheck size={16}/></div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Account Security</p>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1">These will be the SK member's login details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField label="Official SK Email" icon={Mail} value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="sk.member@catarman.com" />
                <EditField label="Temporary Password" icon={Lock} type="password" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} placeholder="Set a strong password" />
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col items-center gap-6">
              <div onClick={() => fileInputRef.current.click()} className="w-44 h-44 rounded-[3rem] overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center relative cursor-pointer group transition-all hover:scale-105">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <User size={48} className="text-gray-200" />}
                <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={32} /></div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              
              <div className="w-full">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Official Position</p>
                <select className="w-full text-xs font-bold bg-gray-100 text-[#0D2440] rounded-xl p-3 outline-none border-2 border-transparent focus:border-indigo-200" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})}>
                  <option>SK Chairman</option>
                  <option>SK Kagawad</option>
                  <option>SK Secretary</option>
                  <option>SK Treasurer</option>
                  <option>SK Member</option>
                </select>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <EditField label="First Name" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                <EditField label="Last Name" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                <EditField label="Contact Number" icon={Phone} value={formData.phone_number} onChange={(v) => setFormData({...formData, phone_number: v})} placeholder="0912..." />
                <EditField label="Birthdate" type="date" value={formData.birthdate} onChange={(v) => setFormData({...formData, birthdate: v})} />
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><MapPin size={12}/> Assigned Barangay</p>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border text-[10px] font-bold">
                    <Search size={12} />
                    <input placeholder="Filter..." className="outline-none w-16" value={brgySearch} onChange={(e) => setBrgySearch(e.target.value)} />
                  </div>
                </div>
                <select className="w-full text-xs font-bold bg-white rounded-xl p-3 shadow-sm outline-none cursor-pointer" value={formData.barangay_id} onChange={(e) => setFormData({...formData, barangay_id: e.target.value})}>
                  <option value="">-- Select Barangay --</option>
                  {filteredBrgy.map(b => {
                    const isTaken = takenBarangays.includes(b.id);
                    return (
                      <option key={b.id} value={b.id} disabled={isTaken} className={isTaken ? "text-gray-300" : ""}>
                        {b.name} {isTaken ? "— (RESERVED)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Complete Home Address</p>
                <textarea 
                  value={formData.complete_address}
                  onChange={(e) => setFormData({...formData, complete_address: e.target.value})}
                  className="w-full text-xs font-bold bg-gray-50 border-2 border-transparent rounded-xl p-3 h-20 outline-none focus:border-indigo-500/20 focus:bg-white transition-all text-[#0D2440]"
                  placeholder="Street, Phase, Landmark..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-6 bg-gray-50 flex justify-end items-center border-t">
          <button disabled={isSaving} onClick={handleSave} className="flex items-center gap-3 px-12 py-4 bg-[#0D2440] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-xl disabled:opacity-50 transition-all">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Creating Account...' : mode === 'add' ? 'Create SK Account' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProfileModal;