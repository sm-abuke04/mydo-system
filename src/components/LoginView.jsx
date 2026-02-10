// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';
// import { 
//   Lock, Phone, ArrowLeft, Loader2, 
//   CheckCircle, Eye, EyeOff, AtSign 
// } from 'lucide-react';

// // Path verified from your project sidebar
// import mydoLogo from '../assets/mydo logo.png';

// const LoginView = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [success, setSuccess] = useState(false);
  
//   // 1. Fields are now strictly empty so your actual credentials aren't exposed
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
//       console.error("Database fetch error:", err);
//     }
//   };

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // 2. THE FIX: If the user types a real email (contains '@'), we use it as-is.
//     // If they type a username (no '@'), we add the hidden suffix for Supabase.
//     const loginIdentifier = username.includes('@') 
//       ? username.trim() 
//       : `${username.toLowerCase().trim()}@mydo.local`;

//     try {
//       if (isSignUp) {
//         // --- SIGN UP PATH ---
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: loginIdentifier,
//           password: password,
//         });

//         if (authError) throw authError;

//         const { error: dbError } = await supabase.from('youths').insert([{
//           id: authData.user.id,
//           username: username.toLowerCase().trim(),
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
//         // --- LOGIN PATH ---
//         // This will now correctly use "mydoofficial@gmail.com" for your Admin account.
//         const { error } = await supabase.auth.signInWithPassword({ 
//           email: loginIdentifier, 
//           password 
//         });
        
//         if (error) throw error;
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
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
//           <p className="text-gray-400 text-sm mt-4">Registration for <b>{username}</b> is pending admin approval.</p>
//           <button onClick={() => { setSuccess(false); setIsSignUp(false); }} className="mt-8 w-full py-4 bg-[#0D2440] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Back to Login</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
//       <div className={`bg-white w-full ${isSignUp ? 'max-w-2xl' : 'max-w-md'} rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500`}>
        
//         <div className="p-8 pb-4 text-center relative bg-white">
//           {isSignUp && (
//             <button type="button" onClick={() => setIsSignUp(false)} className="absolute left-8 top-10 p-2 hover:bg-gray-100 rounded-full text-gray-400">
//               <ArrowLeft size={20} />
//             </button>
//           )}
//           <img src={mydoLogo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
//           <h1 className="text-3xl font-black text-[#0D2440] uppercase tracking-tighter">
//             {isSignUp ? 'Create Account' : 'Login'}
//           </h1>
//         </div>

//         <form onSubmit={handleAuth} className="p-10 pt-4 space-y-6">
//           <div className={`grid gap-5 ${isSignUp ? 'grid-cols-2' : 'grid-cols-1'}`}>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Email or Username</label>
//               <div className="relative">
//                 <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
//                 <input required type="text" placeholder="Email or Username" className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none text-[#0D2440]" value={username} onChange={e => setUsername(e.target.value)}/>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
//                 <input required type={showPassword ? "text" : "password"} placeholder="Your password" size={18} className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none text-[#0D2440]" value={password} onChange={e => setPassword(e.target.value)}/>
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {isSignUp && (
//             <div className="space-y-5">
//               <div className="grid grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-400 uppercase ml-2">First Name</label>
//                   <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}/>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Last Name</label>
//                   <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}/>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-indigo-500 uppercase ml-2">Barangay</label>
//                   <select required className="w-full bg-[#EEF2FF] text-[#4F46E5] rounded-2xl p-4.5 text-xs font-black outline-none cursor-pointer" value={formData.barangay_id} onChange={e => setFormData({...formData, barangay_id: e.target.value})}>
//                     <option value="">Select Barangay</option>
//                     {barangays.map(b => (
//                       <option key={b.id} value={b.id} disabled={takenBarangays.includes(b.id)}>{b.name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Position</label>
//                   <select className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none cursor-pointer" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}>
//                     <option>SK Chairman</option>
//                     <option>SK Kagawad</option>
//                     <option>SK Secretary</option>
//                     <option>SK Treasurer</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Phone Number</label>
//                 <div className="relative">
//                   <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
//                   <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none" placeholder="09..." value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})}/>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button disabled={loading} type="submit" className="w-full bg-[#0D2440] hover:bg-[#1e293b] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 h-16 mt-4">
//             {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Submit Request' : 'Login')}
//           </button>

//           <div className="text-center pt-2">
//             <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-[11px] font-black text-indigo-500 uppercase tracking-widest hover:underline transition-all">
//               {isSignUp ? 'Back to Login' : 'Request Access'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginView;

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Lock, Phone, ArrowLeft, Loader2, 
  CheckCircle, Eye, EyeOff, AtSign 
} from 'lucide-react';

import mydoLogo from '../assets/mydo logo.png';

const LoginView = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [barangays, setBarangays] = useState([]);
  const [takenBarangays, setTakenBarangays] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    barangay_id: '',
    position: 'SK Chairman',
    phone_number: ''
  });

  useEffect(() => {
    if (isSignUp) fetchBarangayData();
  }, [isSignUp]);

  const fetchBarangayData = async () => {
    try {
      const { data: bList } = await supabase.from('barangays').select('id, name').order('name');
      setBarangays(bList || []);
      const { data: taken } = await supabase.from('youths').select('barangay_id').in('status', ['Active', 'PENDING']);
      setTakenBarangays(taken?.map(t => t.barangay_id) || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const loginIdentifier = cleanUser.includes('@') 
      ? cleanUser 
      : `${cleanUser}@mydo.local`;

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: loginIdentifier,
          password: password,
        });

        if (authError) throw authError;

        const { error: dbError } = await supabase.from('youths').insert([{
          id: authData.user.id,
          username: cleanUser.split('@')[0],
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: loginIdentifier, 
          barangay_id: formData.barangay_id,
          position: formData.position,
          phone_number: formData.phone_number,
          role: 'SK',
          status: 'PENDING'
        }]);

        if (dbError) throw dbError;
        setSuccess(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: loginIdentifier, 
          password 
        });
        if (error) throw error;
      }
    } catch (err) {
      alert("System Message: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-12 text-center shadow-2xl border border-gray-100">
          <CheckCircle className="text-[#0D2440] w-20 h-20 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-[#0D2440] uppercase tracking-tighter">Request Sent</h2>
          <p className="text-gray-400 text-sm mt-4">Registration for <b>{username}</b> is pending approval.</p>
          <button onClick={() => { setSuccess(false); setIsSignUp(false); setUsername(''); setPassword(''); }} className="mt-8 w-full py-4 bg-[#0D2440] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className={`bg-white w-full ${isSignUp ? 'max-w-2xl' : 'max-w-md'} rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500`}>
        
        <div className="p-8 pb-4 text-center relative bg-white">
          <img src={mydoLogo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-black text-[#0D2440] uppercase tracking-tighter">
            {isSignUp ? 'SK Registration' : 'Login'}
          </h1>
        </div>

        <form onSubmit={handleAuth} className="p-10 pt-4 space-y-6" autoComplete="off">
          <div className={`grid gap-5 ${isSignUp ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Username</label>
              <div className="relative">
                <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                <input required type="text" placeholder="Enter Username" className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none text-[#0D2440]" value={username} onChange={e => setUsername(e.target.value)}/>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter Password" 
                  className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 pl-14 text-xs font-bold outline-none text-[#0D2440]" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                />
                {/* Fixed the unused error by adding the button back */}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}/>
                <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <select required className="w-full bg-[#EEF2FF] text-[#4F46E5] rounded-2xl p-4.5 text-xs font-black outline-none" value={formData.barangay_id} onChange={e => setFormData({...formData, barangay_id: e.target.value})}>
                  <option value="">Select Barangay</option>
                  {barangays.map(b => (
                    <option key={b.id} value={b.id} disabled={takenBarangays.includes(b.id)}>{b.name}</option>
                  ))}
                </select>
                <select className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}>
                  <option>SK Chairman</option>
                  <option>SK Kagawad</option>
                  <option>SK Secretary</option>
                  <option>SK Treasurer</option>
                </select>
              </div>
              <input required className="w-full bg-[#F3F7FF] rounded-2xl p-4.5 text-xs font-bold outline-none" placeholder="Phone Number" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})}/>
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full bg-[#0D2440] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs h-16 shadow-xl">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isSignUp ? 'Request Account' : 'Login')}
          </button>

          <div className="text-center">
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setUsername(''); setPassword(''); }} className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">
              {isSignUp ? 'Already have an account? Login' : 'Request Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;