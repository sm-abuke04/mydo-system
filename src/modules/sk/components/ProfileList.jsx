import React, { useState } from "react";
import {
  Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Loader2
} from "lucide-react";
import { ProfileService } from "../services/ProfileService";

export default function ProfileList({ profiles, onSearch, onDelete, onEdit, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Increased items per page for table view
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FILTERING ---
  const filteredProfiles = profiles.filter((profile) => {
    if (!profile) return false;
    const searchString = `${profile.firstName || ""} ${profile.lastName || ""} ${profile.id || ""}`;
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

  // Helper for arrays
  const displayArray = (arr) => Array.isArray(arr) ? arr.join(", ") : arr;

  // --- TABLE COLUMNS CONFIG ---
  // Requested: No, Region, Province, City/Municipality, Barangay, Name, Age, Birthday, Sex, Civil Status, Youth Classification, Youth Age Group, Email Address, Contact Number, Home Address (Purok/Zone), Highest Education Attainment, Work Status
  const columns = [
    { header: "ID No.", accessor: "id", width: "w-16" },
    { header: "Region", accessor: "region", width: "w-32" },
    { header: "Province", accessor: "province", width: "w-32" },
    { header: "City/Mun.", accessor: "cityMunicipality", width: "w-32" },
    { header: "Barangay", accessor: "barangay", width: "w-32" },
    { header: "Name", accessor: (p) => `${p.firstName} ${p.lastName}`, width: "w-48 font-bold" },
    { header: "Age", accessor: "age", width: "w-16" },
    { header: "Birthday", accessor: "birthday", width: "w-32" },
    { header: "Sex", accessor: "sex", width: "w-24" },
    { header: "Civil Status", accessor: "civilStatus", width: "w-32" },
    { header: "Classification", accessor: (p) => displayArray(p.youthClassification), width: "w-48 text-xs" },
    { header: "Age Group", accessor: "youthAgeGroup", width: "w-32 text-xs" },
    { header: "Email", accessor: "email", width: "w-48 text-xs" },
    { header: "Contact No.", accessor: "contact", width: "w-32" },
    { header: "Purok/Zone", accessor: "purokZone", width: "w-32" },
    { header: "Education", accessor: "educationalBackground", width: "w-40 text-xs" },
    { header: "Work Status", accessor: "workStatus", width: "w-32" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 flex flex-col h-full overflow-hidden transition-colors">
      
      {/* TOOLBAR */}
      <div className="p-5 border-b border-[#E7F0FA] dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
           <span className="bg-[#2E5E99] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
             {profiles.length} Records
           </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0]" />
            <input
              type="text"
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#2E5E99] dark:text-white w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-[#7BA4D0] hover:text-[#2E5E99] hover:border-[#2E5E99] rounded-xl transition-all shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto relative">
        {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        )}

        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#E7F0FA]/50 dark:bg-gray-800/50 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                    {col.header}
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-bold text-[#7BA4D0] uppercase tracking-wider text-right sticky right-0 bg-[#f9fbfd] dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-700 shadow-l">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7F0FA] dark:divide-gray-700">
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-[#E7F0FA]/50 dark:hover:bg-gray-700/30 transition-colors group">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`px-4 py-3 text-sm text-[#0D2440] dark:text-gray-300 ${col.width || ''}`}>
                        {typeof col.accessor === 'function' ? col.accessor(profile) : (profile[col.accessor] || "---")}
                    </td>
                  ))}

                  {/* ACTIONS COLUMN (Sticky Right) */}
                  <td className="px-4 py-3 text-right sticky right-0 bg-white dark:bg-[#1e293b] group-hover:bg-[#f3f7fc] dark:group-hover:bg-[#252f45] transition-colors border-l border-gray-100 dark:border-gray-700 shadow-l">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit && onEdit(profile.id)}
                        className="p-1.5 text-[#2E5E99] bg-blue-50 hover:bg-[#2E5E99] hover:text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(profile.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-[#7BA4D0] dark:text-gray-500">
                  {searchTerm ? `No profiles found matching "${searchTerm}"` : "No profiles added yet."}
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
