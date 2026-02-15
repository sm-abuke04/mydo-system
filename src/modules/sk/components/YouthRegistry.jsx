import React, { useState, useEffect } from "react";
import { Download, UserPlus } from "lucide-react";
import ProfileList from "./ProfileList";
import ProfileForm from "./ProfileForm";
import { ProfileService } from "../services/ProfileService";

export default function YouthRegistry() {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit'
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // FETCH PROFILES
  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await ProfileService.getAll();
      // Calculate derived fields if needed, but Service now returns camelCase
      const processed = data.map((p) => ({
        ...p,
        youthAgeGroup: p.youthAgeGroup || "N/A", // Ensure value exists
      }));
      setProfiles(processed);
    } catch (error) {
      console.error("Failed to load profiles", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // --- HANDLERS ---
  const handleAddYouth = () => {
    setSelectedProfileId(null);
    setViewMode('add');
  };

  const handleEditYouth = (id) => {
    setSelectedProfileId(id);
    setViewMode('edit');
  };

  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedProfileId(null);
  };

  const handleSaveSuccess = async () => {
    await fetchProfiles();
    setViewMode('list');
  };

  const handleExport = () => {
    alert("Export functionality coming soon!");
    // Logic: Convert `profiles` to CSV/Excel and trigger download
  };

  return (
    <div className="space-y-6 h-full flex flex-col">

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-[#0D2440] dark:text-white uppercase tracking-tight">
            Katipunan ng Kabataan Profile
          </h2>
          <p className="text-sm text-[#7BA4D0] dark:text-gray-400 font-medium">
            Official Registry of Barangay Youth
          </p>
        </div>

        {viewMode === 'list' && (
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-[#d1e3f8] dark:border-gray-600 text-[#2E5E99] dark:text-blue-400 font-bold rounded-xl hover:bg-[#E7F0FA] dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export List</span>
            </button>
            <button
              onClick={handleAddYouth}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#2E5E99] hover:bg-[#0D2440] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              <UserPlus size={18} />
              <span>Add Youth</span>
            </button>
          </div>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <ProfileList
            profiles={profiles}
            onEdit={handleEditYouth}
            onSearch={fetchProfiles} // Pass fetch trigger
            isLoading={isLoading}
          />
        ) : (
          <div className="h-full overflow-y-auto pr-2">
             <ProfileForm
               id={selectedProfileId} // Pass ID if editing
               onCancel={handleCancelForm}
               onSaveSuccess={handleSaveSuccess}
             />
          </div>
        )}
      </div>

    </div>
  );
}
