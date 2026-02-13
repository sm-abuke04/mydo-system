import React, { useState, useEffect } from 'react';
import { Settings, Database, Server, ShieldCheck, Download, Upload, CheckCircle2 } from 'lucide-react';

export default function SystemSettings() {
  
  // State for Settings
  const [settings, setSettings] = useState({
    barangayName: "Barangay Poblacion",
    municipality: "Catarman",
    reportFooter: "SK Secretary"
  });

  const [isSaved, setIsSaved] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sk_system_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("sk_system_settings", JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
  };

  const handleBackup = () => {
    alert("Database backup started... (This is a mock action)");
    // Logic for triggering SQL Dump
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white">System Settings</h2>
        <p className="text-[#2E5E99] dark:text-blue-400">Configure application parameters and data management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
            <div className="p-2 bg-[#E7F0FA] dark:bg-gray-700 rounded-lg">
              <Settings className="w-6 h-6 text-[#2E5E99] dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-[#0D2440] dark:text-white">General Configuration</h3>
              <p className="text-xs text-[#7BA4D0] dark:text-gray-400">Barangay details and system defaults</p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-[#0D2440] dark:text-gray-300 mb-1">Barangay Name</label>
               <input
                 type="text"
                 value={settings.barangayName}
                 onChange={(e) => setSettings({...settings, barangayName: e.target.value})}
                 className="w-full px-4 py-2 border border-[#7BA4D0]/30 dark:border-gray-600 rounded-lg text-[#0D2440] dark:text-white bg-[#E7F0FA]/30 dark:bg-gray-800 focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-[#0D2440] dark:text-gray-300 mb-1">Municipality</label>
               <input
                 type="text"
                 value={settings.municipality}
                 onChange={(e) => setSettings({...settings, municipality: e.target.value})}
                 className="w-full px-4 py-2 border border-[#7BA4D0]/30 dark:border-gray-600 rounded-lg text-[#0D2440] dark:text-white bg-[#E7F0FA]/30 dark:bg-gray-800 focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-[#0D2440] dark:text-gray-300 mb-1">Default Report Footer (Prepared By)</label>
               <input
                 type="text"
                 value={settings.reportFooter}
                 onChange={(e) => setSettings({...settings, reportFooter: e.target.value})}
                 className="w-full px-4 py-2 border border-[#7BA4D0]/30 dark:border-gray-600 rounded-lg text-[#0D2440] dark:text-white bg-[#E7F0FA]/30 dark:bg-gray-800 focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
               />
             </div>

             <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#2E5E99] text-white text-xs font-bold rounded-lg hover:bg-[#0D2440] transition-colors shadow-sm"
                >
                Save Configuration
                </button>
                {isSaved && (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={14} /> Saved!
                    </span>
                )}
             </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
            <div className="p-2 bg-[#E7F0FA] dark:bg-gray-700 rounded-lg">
              <Database className="w-6 h-6 text-[#2E5E99] dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-[#0D2440] dark:text-white">Data Management</h3>
              <p className="text-xs text-[#7BA4D0] dark:text-gray-400">Backup, Restore and Maintenance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg flex items-start gap-3">
              <Server className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800 dark:text-green-300">System Status: Online</p>
                <p className="text-xs text-green-700 dark:text-green-400">Database connection is stable.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={handleBackup} className="flex flex-col items-center justify-center p-4 border border-[#7BA4D0]/40 dark:border-gray-600 rounded-xl hover:bg-[#E7F0FA] dark:hover:bg-gray-700 hover:border-[#2E5E99] dark:hover:border-blue-400 transition-all group bg-white dark:bg-[#1e293b]">
                <Download className="w-8 h-8 text-[#2E5E99] dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-[#0D2440] dark:text-white">Backup Data</span>
                <span className="text-[10px] text-[#7BA4D0] dark:text-gray-400">Download SQL Dump</span>
              </button>

              <button className="flex flex-col items-center justify-center p-4 border border-[#7BA4D0]/40 dark:border-gray-600 rounded-xl hover:bg-[#E7F0FA] dark:hover:bg-gray-700 hover:border-[#2E5E99] dark:hover:border-blue-400 transition-all group bg-white dark:bg-[#1e293b]">
                <Upload className="w-8 h-8 text-[#2E5E99] dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-[#0D2440] dark:text-white">Restore Data</span>
                <span className="text-[10px] text-[#7BA4D0] dark:text-gray-400">Upload .SQL File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs (Placeholder) */}
        <div className="md:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-lg border border-[#7BA4D0]/20 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#2E5E99] dark:text-blue-400" />
            <h3 className="font-bold text-[#0D2440] dark:text-white">Recent System Audit Logs</h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#E7F0FA] dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#E7F0FA] dark:bg-gray-800 text-[#0D2440] dark:text-white">
                <tr>
                  <th className="px-4 py-2 font-bold">Action</th>
                  <th className="px-4 py-2 font-bold">User</th>
                  <th className="px-4 py-2 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0FA] dark:divide-gray-700 bg-white dark:bg-[#1e293b]">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2 text-[#2E5E99] dark:text-blue-400 font-medium">System Backup</td>
                  <td className="px-4 py-2 text-[#0D2440] dark:text-gray-300">Admin</td>
                  <td className="px-4 py-2 text-[#7BA4D0] dark:text-gray-500 text-xs">2 mins ago</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2 text-[#2E5E99] dark:text-blue-400 font-medium">Added New Profile (ID: 104)</td>
                  <td className="px-4 py-2 text-[#0D2440] dark:text-gray-300">SK Secretary</td>
                  <td className="px-4 py-2 text-[#7BA4D0] dark:text-gray-500 text-xs">1 hour ago</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2 text-[#2E5E99] dark:text-blue-400 font-medium">Login Successful</td>
                  <td className="px-4 py-2 text-[#0D2440] dark:text-gray-300">SK Secretary</td>
                  <td className="px-4 py-2 text-[#7BA4D0] dark:text-gray-500 text-xs">3 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
