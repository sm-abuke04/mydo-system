import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  CheckCircle, XCircle, User, 
  MapPin, Phone, Mail, Loader2, Search 
} from 'lucide-react';

const RequestsView = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    // Fetch users with PENDING status. 
    // This includes the usernames and barangay info they submitted.
    const { data, error } = await supabase
      .from('youths')
      .select(`
        *,
        barangays (name)
      `)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching requests:", error);
    else setRequests(data || []);
    setLoading(false);
  };

  const handleAction = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      // Update the status to 'Active' to allow them to log in
      const { error } = await supabase
        .from('youths')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      
      // Remove from the local list once handled
      setRequests(prev => prev.filter(req => req.id !== userId));
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0D2440] mb-2" size={32} />
        <p className="text-xs font-black uppercase text-gray-400">Loading Requests...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">Account Requests</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Review and approve SK Official access</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-100">
          <User className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No pending requests at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-[#F3F7FF] p-4 rounded-2xl text-[#0D2440]">
                  <User size={24} />
                </div>
                <span className="bg-amber-100 text-amber-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Pending
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-[#0D2440] uppercase tracking-tighter">
                  {req.first_name} {req.last_name}
                </h3>
                <p className="text-indigo-500 text-[11px] font-black uppercase tracking-widest">
                  @{req.username}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={14} className="shrink-0" />
                  <span className="text-[10px] font-bold uppercase truncate">
                    {req.barangays?.name || 'No Barangay'} — {req.position}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone size={14} className="shrink-0" />
                  <span className="text-[10px] font-bold uppercase">
                    {req.phone_number}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleAction(req.id, 'Active')}
                  disabled={actionLoading === req.id}
                  className="flex items-center justify-center gap-2 bg-[#0D2440] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors"
                >
                  {actionLoading === req.id ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle size={14} />}
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'Rejected')}
                  disabled={actionLoading === req.id}
                  className="flex items-center justify-center gap-2 bg-gray-50 text-gray-400 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <XCircle size={14} />
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsView;

// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';
// import { 
//   Lock, Phone, ArrowLeft, Loader2, 
//   CheckCircle, Eye, EyeOff, AtSign 
// } from 'lucide-react';

// import mydoLogo from '../assets/mydo logo.png';

// const LoginView = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [success, setSuccess] = useState(false);
  
//   // State is strictly empty to prevent showing Admin credentials
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
  
//   const [barangays, setBarangays] = useState([]);
//   const [takenBarangays, setTakenBarangays] = useState([]);

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     barangay_id: '',
//     position: 'SK Chairman',
//     phone_number: ''
//   });

//   useEffect(() => {
//     if (isSignUp) fetchBarangayData();
//   }, [isSignUp]);

//   const fetchBarangayData = async () => {
//     try {
//       const { data: bList } = await supabase.from('barangays').select('id, name').order('name');
//       setBarangays(bList || []);
//       const { data: taken } = await supabase.from('youths').select('barangay_id').in('status', ['Active', 'PENDING']);
//       setTakenBarangays(taken?.map(t => t.barangay_id) || []);
//     } catch (err) {
//       console.error("Schema fetch error:", err);
//     }
//   };

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Creates the hidden email for Supabase Auth
//     const loginIdentifier = username.includes('@') 
//       ? username.trim() 
//       : `${username.toLowerCase().trim()}@mydo.local`;

//     try {
//       if (isSignUp) {
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: loginIdentifier,
//           password: password,
//         });

//         if (authError) throw authError;

//         // Ensure these column names match your Supabase table EXACTLY
//         const { error: dbError } = await supabase.from('youths').insert([{
//           id: authData.user.id,
//           username: username.toLowerCase().trim(), // Check if this is 'username' in Supabase
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           email: loginIdentifier, 
//           barangay_id: formData.barangay_id,
//           position: formData.position,
//           phone_number: formData.phone_number,
//           role: 'SK',
//           status: 'PENDING'
//         }]);

//         if (dbError) throw dbError;
//         setSuccess(true);
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({ 
//           email: loginIdentifier, 
//           password 
//         });
//         if (error) throw error;
//       }
//     } catch (err) {
//       // If the error is 'column not found', we know it's a database naming issue
//       alert("Database Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
//         <div className="bg-white w-full max-w-md rounded-[2.5rem] p-12 text-center shadow-2xl border border-gray-100">
//           <CheckCircle className="text-[#0D2440] w-20 h-20 mx-auto mb-6" />
//           <h2 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">Request Sent</h2>
//           <p className="text-gray-400 text-sm mt-4">Account for <b>{username}</b> is pending approval.</p>
//           <button onClick={() => { setSuccess(false); setIsSignUp(false); setUsername(''); setPassword(''); }} className="mt-8 w-full py-4 bg-[#0D2440] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Back to Login</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
//       <div className={`bg-white w-full ${isSignUp ? 'max-w-2xl' : 'max-w-md'} rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500`}>
        
//         <div className="p-8 pb-4 text-center relative bg-white">
//           <img src={mydoLogo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
//           <h1 className="text-3xl font-black text-[#0D2440] uppercase tracking-tighter">
//             {isSignUp ? 'Create Account' : 'Login'}
//           </h1>
//         </div>

//         {/* autoComplete="off" and random names help stop browser autofill */}
//         <form onSubmit={handleAuth} className="p-10 pt-4 space-y-6" autoComplete="off">
//           <div className={`grid gap-5 ${isSignUp ? 'grid-cols-2' : 'grid-cols-1'}`}>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Username</label>
//               <div className="relative">
//                 <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
//                 <input 
//                   required 
//                   type="text" 
//                   name="sk_username_field"
//                   placeholder="Enter Username" 
//                   className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none text-[#0D2440]" 
//                   value={username} 
//                   onChange={e => setUsername(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
//                 <input 
//                   required 
//                   type={showPassword ? "text" : "password"} 
//                   name="sk_password_field"
//                   placeholder="Enter Password" 
//                   className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none text-[#0D2440]" 
//                   value={password} 
//                   onChange={e => setPassword(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {isSignUp && (
//             <div className="space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}/>
//                 <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}/>
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <select required className="w-full bg-[#EEF2FF] text-[#4F46E5] rounded-2xl p-4.5 text-xs font-black outline-none" value={formData.barangay_id} onChange={e => setFormData({...formData, barangay_id: e.target.value})}>
//                   <option value="">Select Barangay</option>
//                   {barangays.map(b => (
//                     <option key={b.id} value={b.id} disabled={takenBarangays.includes(b.id)}>{b.name}</option>
//                   ))}
//                 </select>
//                 <select className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}>
//                   <option>SK Chairman</option>
//                   <option>SK Kagawad</option>
//                 </select>
//               </div>
//               <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="Phone Number" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})}/>
//             </div>
//           )}

//           <button disabled={loading} type="submit" className="w-full bg-[#0D2440] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs shadow-xl h-16">
//             {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isSignUp ? 'Submit Request' : 'Login')}
//           </button>

//           <div className="text-center">
//             <button type="button" onClick={() => { setIsSignUp(!isSignUp); setUsername(''); setPassword(''); }} className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">
//               {isSignUp ? 'Back to Login' : 'Request Access'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginView;