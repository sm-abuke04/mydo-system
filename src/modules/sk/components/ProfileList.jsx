import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Edit, Trash2, Eye, MoreVertical,
  ChevronLeft, ChevronRight, Filter, Briefcase, GraduationCap
} from "lucide-react";
import { ProfileService } from "../services/ProfileService";

export default function ProfileList({ profiles, onSearch, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FILTERING ---
  const filteredProfiles = profiles.filter((profile) => {
    if (!profile) return false;
    const searchString = `${profile.firstName || ""} ${profile.lastName || ""} ${profile.skmtNo || ""}`;
    return searchString.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      if(onDelete) {
         await onDelete(id);
      } else {
         await ProfileService.delete(id);
         if (onSearch) onSearch(); // Refresh the list
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete profile. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 flex flex-col h-full overflow-hidden transition-colors">
      
      {/* HEADER & TOOLBAR */}
      <div className="p-5 border-b border-[#E7F0FA] dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
          <span className="bg-[#2E5E99] text-white text-xs px-2 py-1 rounded-md">{profiles.length}</span>
          Youth Profiles
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0]" />
            <input
              type="text"
              placeholder="Search name or SKMT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#E7F0FA] dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#2E5E99] dark:text-white w-64"
            />
          </div>
          <button className="p-2 text-[#7BA4D0] hover:bg-[#E7F0FA] dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E7F0FA]/50 dark:bg-gray-800/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">SKMT ID</th>
              <th className="px-6 py-4 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Profile Details</th>
              <th className="px-6 py-4 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Work & Education</th>
              <th className="px-6 py-4 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider">Classification</th>
              <th className="px-6 py-4 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7F0FA] dark:divide-gray-700">
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-[#E7F0FA]/50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-[#2E5E99] dark:text-blue-400 font-mono align-top pt-5">
                    {profile.skmtNo || "---"}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-[#0D2440] dark:text-white">
                        {profile.lastName}, {profile.firstName}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#7BA4D0] dark:text-gray-500">
                         <span>{profile.age} yrs old • {profile.sex}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                         <span>{profile.civilStatus}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                        Brgy. {profile.barangay} {profile.purokZone && `(Prk. ${profile.purokZone})`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-2">
                        {profile.workStatus && (
                            <span className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                                <Briefcase className="w-3 h-3 text-[#2E5E99]" /> {profile.workStatus}
                            </span>
                        )}
                        {profile.educationalBackground && (
                            <span className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                                <GraduationCap className="w-3 h-3 text-orange-500" /> {profile.educationalBackground}
                            </span>
                        )}
                        {!profile.workStatus && !profile.educationalBackground && <span className="text-xs text-gray-400 italic">No info</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top pt-5">
                     <div className="flex flex-wrap gap-1">
                        {/* Display Youth Age Group if available */}
                        {profile.youthAgeGroup && (
                            <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-bold uppercase">
                                {profile.youthAgeGroup.split(' ')[0]}
                            </span>
                        )}

                        {/* Display Classification Badge */}
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        (Array.isArray(profile.youthClassification) ? profile.youthClassification : [profile.youthClassification]).includes('In School Youth')
                            ? 'bg-green-50 text-green-600 border-green-100'
                            : 'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                        {Array.isArray(profile.youthClassification) && profile.youthClassification.length > 0
                            ? (profile.youthClassification.includes('In School Youth') ? 'In School' : 'Out of School')
                            : (profile.youthClassification || "Unclassified")}
                        </span>

                        {/* More indicator */}
                        {Array.isArray(profile.youthClassification) && profile.youthClassification.length > 1 && (
                            <span className="px-1.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold" title={profile.youthClassification.join(', ')}>
                                +{profile.youthClassification.length - 1}
                            </span>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right align-top pt-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/sk/edit/${profile.id}`} className="p-2 text-[#2E5E99] bg-blue-50 hover:bg-[#2E5E99] hover:text-white rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(profile.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-[#7BA4D0] dark:text-gray-500">
                  No profiles found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-[#E7F0FA] dark:border-gray-700 flex justify-between items-center bg-[#FAFAFA] dark:bg-[#1e293b]">
        <p className="text-xs font-medium text-[#7BA4D0]">
          Showing {paginatedProfiles.length} of {filteredProfiles.length} records
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-[#E7F0FA] dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 dark:text-white" />
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-[#E7F0FA] dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4 dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}