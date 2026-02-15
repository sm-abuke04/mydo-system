import React, { useState, useEffect } from 'react';
import { Settings, Database, Server, ShieldCheck, Download, Upload, CheckCircle2, UserCog, Save, RotateCcw } from 'lucide-react';

export default function SystemSettings() {
  
  // State for Settings
  const [settings, setSettings] = useState({
    barangayName: "Barangay Poblacion",
    municipality: "Catarman",
    province: "Northern Samar",
    reportFooter: "SK Secretary",
    reportNotedBy: "SK Chairperson",
    theme: "light",
    enableAutoBackup: false
  });

  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sk_system_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Track changes
  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("sk_system_settings", JSON.stringify(settings));
    setIsSaved(true);
    setHasChanges(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if(confirm("Reset all settings to default?")) {
        const defaults = {
            barangayName: "Barangay Poblacion",
            municipality: "Catarman",
            province: "Northern Samar",
            reportFooter: "SK Secretary",
            reportNotedBy: "SK Chairperson",
            theme: "light",
            enableAutoBackup: false
        };
        setSettings(defaults);
        localStorage.setItem("sk_system_settings", JSON.stringify(defaults));
        setHasChanges(false);
    }
  };

  const handleBackup = () => {
    // Simulate SQL Dump creation
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings)); // Mock content
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "sk_system_settings_backup.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert("Settings backup downloaded successfully.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-[#0D2440] dark:text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-[#2E5E99]" /> System Configuration
            </h2>
            <p className="text-[#7BA4D0] dark:text-blue-400 font-medium mt-1 ml-11">
                Manage application preferences and data
            </p>
        </div>

        {hasChanges && (
            <div className="flex items-center gap-3 animate-in slide-in-from-right-4">
                <span className="text-xs text-orange-500 font-bold italic">Unsaved Changes</span>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-[#2E5E99] text-white font-bold rounded-xl hover:bg-[#0D2440] shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: General Settings */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
                <div className="p-3 bg-[#E7F0FA] dark:bg-gray-800 rounded-xl text-[#2E5E99] dark:text-blue-400">
                <UserCog className="w-6 h-6" />
                </div>
                <div>
                <h3 className="text-xl font-bold text-[#0D2440] dark:text-white">Organization Details</h3>
                <p className="text-xs text-[#7BA4D0] dark:text-gray-400 font-bold uppercase tracking-wide">Report Headers & Signatories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Barangay Name</label>
                    <input
                        type="text"
                        value={settings.barangayName}
                        onChange={(e) => handleChange('barangayName', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-700 rounded-xl text-[#0D2440] dark:text-white font-bold focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
                        placeholder="e.g. Barangay Poblacion"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Municipality</label>
                    <input
                        type="text"
                        value={settings.municipality}
                        onChange={(e) => handleChange('municipality', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-700 rounded-xl text-[#0D2440] dark:text-white font-bold focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Province</label>
                    <input
                        type="text"
                        value={settings.province}
                        onChange={(e) => handleChange('province', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-700 rounded-xl text-[#0D2440] dark:text-white font-bold focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 border-t border-[#E7F0FA] dark:border-gray-700 my-2"></div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Report Prepared By (Default)</label>
                    <input
                        type="text"
                        value={settings.reportFooter}
                        onChange={(e) => handleChange('reportFooter', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-700 rounded-xl text-[#0D2440] dark:text-white font-bold focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
                        placeholder="Position Title"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Report Noted By (Default)</label>
                    <input
                        type="text"
                        value={settings.reportNotedBy}
                        onChange={(e) => handleChange('reportNotedBy', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-700 rounded-xl text-[#0D2440] dark:text-white font-bold focus:ring-2 focus:ring-[#2E5E99] outline-none transition-all"
                        placeholder="Position Title"
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7F0FA] dark:border-gray-700 flex justify-end gap-3">
                 <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-400 hover:text-red-500 text-xs font-bold transition-colors flex items-center gap-1"
                >
                    <RotateCcw size={14} /> Reset Defaults
                </button>
                {isSaved && (
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={16} /> Configuration Saved!
                    </span>
                )}
            </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                    <ShieldCheck className="w-6 h-6 text-[#2E5E99] dark:text-blue-400" />
                    <h3 className="text-xl font-bold text-[#0D2440] dark:text-white">Recent Audit Logs</h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#E7F0FA] dark:border-gray-700">
                    <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC] dark:bg-gray-800 text-[#0D2440] dark:text-white uppercase text-[10px] tracking-wider">
                        <tr>
                        <th className="px-6 py-4 font-bold">Action</th>
                        <th className="px-6 py-4 font-bold">User</th>
                        <th className="px-6 py-4 font-bold text-right">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7F0FA] dark:divide-gray-700 bg-white dark:bg-[#1e293b]">
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#2E5E99] dark:text-blue-400">Settings Updated</td>
                        <td className="px-6 py-4 font-medium text-[#0D2440] dark:text-gray-300">Admin</td>
                        <td className="px-6 py-4 text-[#7BA4D0] dark:text-gray-500 text-xs text-right">Just now</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#2E5E99] dark:text-blue-400">Added New Profile (ID: 104)</td>
                        <td className="px-6 py-4 font-medium text-[#0D2440] dark:text-gray-300">SK Secretary</td>
                        <td className="px-6 py-4 text-[#7BA4D0] dark:text-gray-500 text-xs text-right">1 hour ago</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#2E5E99] dark:text-blue-400">Login Successful</td>
                        <td className="px-6 py-4 font-medium text-[#0D2440] dark:text-gray-300">SK Secretary</td>
                        <td className="px-6 py-4 text-[#7BA4D0] dark:text-gray-500 text-xs text-right">3 hours ago</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Data Management */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
                <div className="p-3 bg-[#E7F0FA] dark:bg-gray-800 rounded-xl text-[#2E5E99] dark:text-blue-400">
                <Database className="w-6 h-6" />
                </div>
                <div>
                <h3 className="text-xl font-bold text-[#0D2440] dark:text-white">Data Management</h3>
                <p className="text-xs text-[#7BA4D0] dark:text-gray-400 font-bold uppercase tracking-wide">Backup & Restore</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl flex items-center gap-4">
                    <div className="relative">
                        <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-green-50 animate-pulse"></span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-green-800 dark:text-green-300">System Online</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-green-700/70 dark:text-green-400/70">Connection Stable</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={handleBackup} className="w-full flex items-center justify-between p-4 border border-[#E7F0FA] dark:border-gray-600 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-gray-800 hover:border-[#2E5E99] dark:hover:border-blue-400 transition-all group bg-white dark:bg-[#1e293b]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#E7F0FA] dark:bg-gray-700 rounded-lg text-[#2E5E99] dark:text-blue-400 group-hover:bg-[#2E5E99] group-hover:text-white transition-colors">
                                <Download size={18} />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-[#0D2440] dark:text-white">Backup Settings</span>
                                <span className="block text-[10px] text-[#7BA4D0] dark:text-gray-400">Download JSON Config</span>
                            </div>
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-[#E7F0FA] dark:border-gray-600 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-gray-800 hover:border-[#2E5E99] dark:hover:border-blue-400 transition-all group bg-white dark:bg-[#1e293b]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#E7F0FA] dark:bg-gray-700 rounded-lg text-[#2E5E99] dark:text-blue-400 group-hover:bg-[#2E5E99] group-hover:text-white transition-colors">
                                <Upload size={18} />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-[#0D2440] dark:text-white">Restore Data</span>
                                <span className="block text-[10px] text-[#7BA4D0] dark:text-gray-400">Upload Backup File</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            </div>
        </div>

      </div>
    </div>
  );
}