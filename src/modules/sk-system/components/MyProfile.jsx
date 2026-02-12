import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera, Lock } from 'lucide-react';

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock Admin Data
  const [adminData, setAdminData] = useState({
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    role: 'SK Secretary',
    email: 'sk.secretary@barangay.gov.ph',
    contact: '0917-123-4567',
    barangay: 'Barangay Poblacion',
    municipality: 'Catarman'
  });

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert("Profile updated successfully!");
    // In a real app, you would send a PUT request here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0D2440]">My Profile</h2>
        <p className="text-[#2E5E99]">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20 flex flex-col items-center text-center h-fit">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#2E5E99] to-[#0D2440] flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-md">
              {adminData.firstName[0]}{adminData.lastName[0]}
            </div>
            <button className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-md text-[#2E5E99] hover:text-[#0D2440] transition-colors border border-[#E7F0FA]">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-[#0D2440]">{adminData.firstName} {adminData.lastName}</h3>
          <span className="px-3 py-1 bg-[#E7F0FA] text-[#2E5E99] text-xs font-bold uppercase rounded-full mt-2">
            {adminData.role}
          </span>
          
          <div className="w-full mt-6 pt-6 border-t border-[#E7F0FA] text-left space-y-3">
             <div className="flex items-center gap-3 text-sm text-[#0D2440]">
               <MapPin className="w-4 h-4 text-[#7BA4D0]" />
               {adminData.barangay}, {adminData.municipality}
             </div>
             <div className="flex items-center gap-3 text-sm text-[#0D2440]">
               <Mail className="w-4 h-4 text-[#7BA4D0]" />
               {adminData.email}
             </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-[#7BA4D0]/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#0D2440] flex items-center gap-2">
              <User className="w-5 h-5 text-[#2E5E99]" /> Personal Information
            </h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-sm font-bold text-[#2E5E99] hover:underline"
              >
                Edit Details
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D2440] mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={adminData.firstName} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#E7F0FA]/50 border border-[#7BA4D0]/30 rounded-lg focus:ring-2 focus:ring-[#2E5E99] outline-none disabled:opacity-60 disabled:cursor-not-allowed text-[#0D2440]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0D2440] mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={adminData.lastName} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#E7F0FA]/50 border border-[#7BA4D0]/30 rounded-lg focus:ring-2 focus:ring-[#2E5E99] outline-none disabled:opacity-60 disabled:cursor-not-allowed text-[#0D2440]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D2440] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#7BA4D0]" />
                <input 
                  type="email" 
                  name="email" 
                  value={adminData.email} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 bg-[#E7F0FA]/50 border border-[#7BA4D0]/30 rounded-lg focus:ring-2 focus:ring-[#2E5E99] outline-none disabled:opacity-60 disabled:cursor-not-allowed text-[#0D2440]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D2440] mb-1">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#7BA4D0]" />
                <input 
                  type="text" 
                  name="contact" 
                  value={adminData.contact} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 bg-[#E7F0FA]/50 border border-[#7BA4D0]/30 rounded-lg focus:ring-2 focus:ring-[#2E5E99] outline-none disabled:opacity-60 disabled:cursor-not-allowed text-[#0D2440]"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end gap-3 animate-in fade-in">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-bold text-[#7BA4D0] hover:text-[#0D2440]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-[#2E5E99] text-white text-sm font-bold rounded-lg hover:bg-[#0D2440] transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </form>

          {/* Security Section (Static) */}
          <div className="mt-8 pt-6 border-t border-[#E7F0FA]">
             <h3 className="text-lg font-bold text-[#0D2440] flex items-center gap-2 mb-4">
               <Lock className="w-5 h-5 text-[#2E5E99]" /> Security
             </h3>
             <button className="w-full py-3 border border-[#7BA4D0] text-[#0D2440] font-semibold rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-sm">
               Reset Password
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}