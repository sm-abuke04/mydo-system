import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MydoService } from "../mydo/services/MYDOService";

export default function RequestAccountModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [barangays, setBarangays] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    barangay: "", position: "SK_CHAIR" // Default
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load Barangays on Open
  useEffect(() => {
    if (isOpen) {
      loadBarangays();
      setStep(1);
      setError("");
      setSuccess(false);
      setFormData({ firstName: "", lastName: "", email: "", password: "", barangay: "", position: "SK_CHAIR" });
    }
  }, [isOpen]);

  const loadBarangays = async () => {
    try {
      const data = await MydoService.getAllBarangays();
      setBarangays(data || []);
    } catch (err) {
      console.error("Failed to load barangays");
    }
  };

  const checkAvailability = async () => {
    if (!formData.barangay) return;
    setIsLoading(true);
    try {
      // Call the RPC function we created in SQL
      const { data: isAvailable, error } = await supabase.rpc('check_barangay_availability', { 
        target_barangay: formData.barangay 
      });

      if (error) throw error;

      if (!isAvailable) {
        setError(`An active account already exists for Brgy. ${formData.barangay}.`);
        setIsLoading(false);
        return false;
      }
      return true;
    } catch (err) {
      setError("Failed to verify barangay availability.");
      setIsLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Check Availability First
    const available = await checkAvailability();
    if (!available) return;

    setIsLoading(true);

    try {
      // 2. Register in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.position,
            barangay: formData.barangay
          }
        }
      });

      if (authError) throw authError;

      // 3. Create Profile in Public Users Table (With Pending Status)
      if (authData.user) {
        const { error: dbError } = await supabase.from('users').insert([{
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.position,
          barangay: formData.barangay,
          status: 'Pending' // Important: Admin must approve later
        }]);

        if (dbError) throw dbError;
        setSuccess(true);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#0D2440] p-6 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Request Access</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#0D2440] dark:text-white mb-2">Request Submitted!</h4>
              <p className="text-gray-500 text-sm mb-6">
                Your account for <strong>{formData.barangay}</strong> has been created and is pending approval by the MYDO Admin.
              </p>
              <button onClick={onClose} className="w-full py-3 bg-[#0D2440] text-white rounded-xl font-bold">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input required type="text" onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input required type="text" onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold dark:text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input required type="email" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold dark:text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Position</label>
                <select onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold dark:text-white">
                  <option value="SK_CHAIR">SK Chairperson</option>
                  <option value="SK_SEC">SK Secretary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Barangay</label>
                <select required value={formData.barangay} onChange={e => setFormData({...formData, barangay: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold dark:text-white">
                  <option value="">Select Barangay</option>
                  {barangays.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400">Only one active account allowed per barangay.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                <input required type="password" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold dark:text-white" />
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#2E5E99] hover:bg-[#0D2440] text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all mt-4">
                {isLoading ? <Loader2 className="animate-spin" /> : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}