import React, { useState } from 'react';
import { User, Mail, MapPin, Shield, Edit2, Check, X, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function MyProfile() {
  const { user } = useAuth();

  // State for Change Password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  if (!user) return <div>Loading...</div>;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (passwordForm.new !== passwordForm.confirm) {
        setMsg({ type: "error", text: "New passwords do not match." });
        return;
    }

    if (passwordForm.new.length < 6) {
        setMsg({ type: "error", text: "Password must be at least 6 characters." });
        return;
    }

    try {
        const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
        if (error) throw error;

        setMsg({ type: "success", text: "Password updated successfully!" });
        setPasswordForm({ current: "", new: "", confirm: "" });
        setIsChangingPassword(false);
    } catch (error) {
        setMsg({ type: "error", text: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 shadow-sm border border-[#E7F0FA] dark:border-gray-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#2E5E99] to-[#0D2440] opacity-10"></div>

        <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-[#2E5E99] dark:text-blue-400 text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg z-10 shrink-0">
          {user.first_name?.[0]}{user.last_name?.[0]}
        </div>
        <div className="text-center md:text-left space-y-2 z-10">
          <h2 className="text-3xl font-bold text-[#0D2440] dark:text-white">
            {user.first_name} {user.last_name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2E5E99] dark:text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-blue-100 dark:border-blue-800">
              <Shield size={12} /> {user.role?.replace('_', ' ') || 'SK Official'}
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-orange-100 dark:border-orange-800">
              <MapPin size={12} /> Brgy. {user.barangay || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Account Info */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 h-full">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#E7F0FA] dark:border-gray-700">
            <h3 className="font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
                <User size={18} className="text-[#2E5E99]"/> Account Information
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider mb-1 block">Email Address</label>
              <div className="flex items-center gap-3 text-[#0D2440] dark:text-gray-200 font-medium bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <Mail size={18} className="text-gray-400" /> {user.email}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider mb-1 block">User ID</label>
              <div className="flex items-center gap-3 text-[#0D2440] dark:text-gray-200 font-medium bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <User size={18} className="text-gray-400" /> <span className="text-xs font-mono">{user.id}</span>
              </div>
            </div>
             <div>
              <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider mb-1 block">Status</label>
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                 <Check size={18} /> Active
              </div>
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 h-full">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#E7F0FA] dark:border-gray-700">
            <h3 className="font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
                <Lock size={18} className="text-[#2E5E99]"/> Security
            </h3>
          </div>

          {!isChangingPassword ? (
             <div className="flex flex-col h-48 justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                    <Lock size={32} />
                </div>
                <div>
                    <p className="text-sm font-bold text-[#0D2440] dark:text-white">Password Management</p>
                    <p className="text-xs text-gray-500 max-w-[200px] mx-auto mt-1">Update your password regularly to keep your account secure.</p>
                </div>
                <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-6 py-2 bg-[#E7F0FA] dark:bg-gray-700 text-[#2E5E99] dark:text-white font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                    Change Password
                </button>
             </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {msg.text && (
                    <div className={`text-xs p-2 rounded-lg font-bold text-center ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {msg.text}
                    </div>
                )}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">New Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#2E5E99] outline-none"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Confirm Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#2E5E99] outline-none"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    />
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => { setIsChangingPassword(false); setMsg({type:"", text:""}); }}
                        className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-[#2E5E99] text-white font-bold rounded-lg hover:bg-[#0D2440] transition-colors text-xs"
                    >
                        Update Password
                    </button>
                </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
