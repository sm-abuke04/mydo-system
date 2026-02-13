import React from 'react';
import { User, Mail, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; // Import from global context

export default function MyProfile() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 shadow-sm border border-[#E7F0FA] dark:border-gray-700 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-[#2E5E99] dark:text-blue-400 text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg">
          {user.first_name?.[0]}{user.last_name?.[0]}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-[#0D2440] dark:text-white">
            {user.first_name} {user.last_name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2E5E99] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Shield size={12} /> {user.role || 'SK Official'}
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <MapPin size={12} /> Brgy. {user.barangay || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
          <h3 className="font-bold text-[#0D2440] dark:text-white mb-4 border-b border-[#E7F0FA] dark:border-gray-700 pb-2">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Email Address</label>
              <div className="flex items-center gap-2 text-[#0D2440] dark:text-gray-200 font-medium">
                <Mail size={16} /> {user.email}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">User ID</label>
              <div className="flex items-center gap-2 text-[#0D2440] dark:text-gray-200 font-medium">
                <User size={16} /> {user.id}
              </div>
            </div>
          </div>
        </div>
        
        {/* Security / Settings Placeholder */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
          <h3 className="font-bold text-[#0D2440] dark:text-white mb-4 border-b border-[#E7F0FA] dark:border-gray-700 pb-2">Security Settings</h3>
          <button className="w-full py-3 bg-[#E7F0FA] dark:bg-gray-700 text-[#2E5E99] dark:text-white font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}