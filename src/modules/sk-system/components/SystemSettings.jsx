import React from 'react';
import { Settings, Database, Server, ShieldCheck, Download, Upload } from 'lucide-react';

export default function SystemSettings() {
  
  const handleBackup = () => {
    alert("Database backup started...");
    // Logic for triggering SQL Dump
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-[#0D2440]">System Settings</h2>
        <p className="text-[#2E5E99]">Configure application parameters and data management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E7F0FA]">
            <div className="p-2 bg-[#E7F0FA] rounded-lg">
              <Settings className="w-6 h-6 text-[#2E5E99]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0D2440]">General Configuration</h3>
              <p className="text-xs text-[#7BA4D0]">Barangay details and system defaults</p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-[#0D2440] mb-1">Barangay Name</label>
               <input type="text" defaultValue="Barangay Poblacion" className="w-full px-4 py-2 border border-[#7BA4D0]/30 rounded-lg text-[#0D2440] bg-[#E7F0FA]/30 focus:ring-2 focus:ring-[#2E5E99] outline-none" />
             </div>
             <div>
               <label className="block text-xs font-bold text-[#0D2440] mb-1">Municipality</label>
               <input type="text" defaultValue="Catarman" className="w-full px-4 py-2 border border-[#7BA4D0]/30 rounded-lg text-[#0D2440] bg-[#E7F0FA]/30 focus:ring-2 focus:ring-[#2E5E99] outline-none" />
             </div>
             <div>
               <label className="block text-xs font-bold text-[#0D2440] mb-1">Default Report Footer (Prepared By)</label>
               <input type="text" defaultValue="SK Secretary" className="w-full px-4 py-2 border border-[#7BA4D0]/30 rounded-lg text-[#0D2440] bg-[#E7F0FA]/30 focus:ring-2 focus:ring-[#2E5E99] outline-none" />
             </div>
             <button className="px-4 py-2 bg-[#2E5E99] text-white text-xs font-bold rounded-lg hover:bg-[#0D2440] transition-colors mt-2">
               Save Configuration
             </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E7F0FA]">
            <div className="p-2 bg-[#E7F0FA] rounded-lg">
              <Database className="w-6 h-6 text-[#2E5E99]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0D2440]">Data Management</h3>
              <p className="text-xs text-[#7BA4D0]">Backup, Restore and Maintenance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Server className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">System Status: Online</p>
                <p className="text-xs text-green-700">Database connection is stable.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={handleBackup} className="flex flex-col items-center justify-center p-4 border border-[#7BA4D0]/40 rounded-xl hover:bg-[#E7F0FA] hover:border-[#2E5E99] transition-all group">
                <Download className="w-8 h-8 text-[#2E5E99] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-[#0D2440]">Backup Data</span>
                <span className="text-[10px] text-[#7BA4D0]">Download SQL Dump</span>
              </button>

              <button className="flex flex-col items-center justify-center p-4 border border-[#7BA4D0]/40 rounded-xl hover:bg-[#E7F0FA] hover:border-[#2E5E99] transition-all group">
                <Upload className="w-8 h-8 text-[#2E5E99] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-[#0D2440]">Restore Data</span>
                <span className="text-[10px] text-[#7BA4D0]">Upload .SQL File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs (Placeholder) */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#2E5E99]" />
            <h3 className="font-bold text-[#0D2440]">Recent System Audit Logs</h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#E7F0FA]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#E7F0FA] text-[#0D2440]">
                <tr>
                  <th className="px-4 py-2 font-bold">Action</th>
                  <th className="px-4 py-2 font-bold">User</th>
                  <th className="px-4 py-2 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0FA]">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-[#2E5E99] font-medium">System Backup</td>
                  <td className="px-4 py-2 text-[#0D2440]">Admin</td>
                  <td className="px-4 py-2 text-[#7BA4D0] text-xs">2 mins ago</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-[#2E5E99] font-medium">Added New Profile (ID: 104)</td>
                  <td className="px-4 py-2 text-[#0D2440]">SK Secretary</td>
                  <td className="px-4 py-2 text-[#7BA4D0] text-xs">1 hour ago</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-[#2E5E99] font-medium">Login Successful</td>
                  <td className="px-4 py-2 text-[#0D2440]">SK Secretary</td>
                  <td className="px-4 py-2 text-[#7BA4D0] text-xs">3 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}