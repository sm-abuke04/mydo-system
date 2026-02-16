import React, { useState } from "react";
import {
  Search, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Loader2, MoreHorizontal, X
} from "lucide-react";
import { ProfileService } from "../services/ProfileService";

export default function ProfileList({ profiles, onSearch, onDelete, onEdit, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    age: "",
    sex: "",
    purokZone: "",
    birthday: ""
  });

  const resetFilters = () => {
    setFilters({ age: "", sex: "", purokZone: "", birthday: "" });
    setShowFilters(false);
  };

  // --- FILTERING & SORTING ---
  const filteredProfiles = profiles
    .filter((profile) => {
      if (!profile) return false;
      const searchString = `${profile.firstName || ""} ${profile.lastName || ""} ${profile.id || ""}`;
      const matchesSearch = searchString.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply Filters
      const matchesAge = filters.age ? profile.age?.toString() === filters.age : true;
      const matchesSex = filters.sex ? (profile.sex || "").toLowerCase() === filters.sex.toLowerCase() : true;
      const matchesPurok = filters.purokZone ? (profile.purokZone || "").toLowerCase().includes(filters.purokZone.toLowerCase()) : true;
      const matchesBirthday = filters.birthday ? profile.birthday === filters.birthday : true;

      return matchesSearch && matchesAge && matchesSex && matchesPurok && matchesBirthday;
    })
    .sort((a, b) => {
      // Mandatory Sort by Last Name ASC
      const nameA = (a.lastName || "").toLowerCase();
      const nameB = (b.lastName || "").toLowerCase();
      return nameA.localeCompare(nameB);
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

  // Helper for formatting name: Last, First, Suffix, Middle
  const formatName = (p) => {
     return `${p.lastName || ''}, ${p.firstName || ''}${p.suffix ? `, ${p.suffix}` : ''}${p.middleName ? `, ${p.middleName}` : ''}`;
  };

  // Helper for arrays
  const displayArray = (arr) => Array.isArray(arr) ? arr.join(", ") : arr;

  // --- TABLE COLUMNS CONFIG ---
  // Sticky Columns Logic:
  // "NO." (Index 0) -> Left 0
  // "NAME" (Index 1) -> Left 48px (width of NO.)
  // "ACTION" -> Right 0
  const columns = [
    {
        header: "NO.",
        accessor: (p, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
        width: "w-12 text-center",
        sticky: "left-0 z-20"
    },
    {
        header: "NAME",
        accessor: (p) => formatName(p),
        width: "w-64 font-bold",
        sticky: "left-12 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]" // Add shadow to indicate scroll
    },
    // New Columns Requested
    { header: "REGION", accessor: "region", width: "w-32" },
    { header: "PROVINCE", accessor: "province", width: "w-32" },
    { header: "CITY/MUN.", accessor: "cityMunicipality", width: "w-32" },
    { header: "BARANGAY", accessor: "barangay", width: "w-32" },
    { header: "PUROK/ZONE", accessor: "purokZone", width: "w-32" },
    { header: "AGE", accessor: "age", width: "w-16" },
    { header: "BIRTHDAY", accessor: "birthday", width: "w-32" },
    { header: "SEX", accessor: "sex", width: "w-24" },

    { header: "CIVIL STATUS", accessor: (p) => (p.civilStatus || "").toUpperCase(), width: "w-32" },
    { header: "YOUTH CLASS", accessor: (p) => displayArray(p.youthClassification), width: "w-40" },
    { header: "AGE GROUP", accessor: "youthAgeGroup", width: "w-40" },
    { header: "EMAIL", accessor: (p) => <a href={`mailto:${p.email}`} className="text-[#2E5E99] hover:underline truncate block">{p.email}</a>, width: "w-48 text-xs" },
    { header: "CONTACT", accessor: "contact", width: "w-32" },
    { header: "EDUCATION", accessor: "educationalBackground", width: "w-40 text-xs" },
    { header: "WORK STATUS", accessor: "workStatus", width: "w-32" },
  ];

  return (
    <div className="bg-[#1a1d21] dark:bg-[#1a1d21] rounded-xl shadow-lg border border-gray-800 flex flex-col h-full overflow-hidden transition-colors text-gray-300">
      
      {/* TOOLBAR */}
      <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1d21]">
        {/* Filters Panel (Collapsible) */}
        {showFilters && (
          <div className="absolute top-20 left-4 right-4 z-30 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between md:hidden col-span-1">
               <h3 className="font-bold">Filters</h3>
               <button onClick={() => setShowFilters(false)}><X size={16}/></button>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Age</label>
                <input
                  type="number"
                  value={filters.age}
                  onChange={(e) => setFilters({...filters, age: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="e.g. 18"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Sex</label>
                <select
                  value={filters.sex}
                  onChange={(e) => setFilters({...filters, sex: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Purok/Zone</label>
                <input
                  type="text"
                  value={filters.purokZone}
                  onChange={(e) => setFilters({...filters, purokZone: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="e.g. Zone 1"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Birthday</label>
                <input
                  type="date"
                  value={filters.birthday}
                  onChange={(e) => setFilters({...filters, birthday: e.target.value})}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                <button onClick={resetFilters} className="text-xs text-red-500 hover:underline">Reset</button>
                <button onClick={() => setShowFilters(false)} className="px-4 py-1 bg-[#2E5E99] text-white rounded-lg text-sm">Apply</button>
            </div>
          </div>
        )}

        {/* Start of Toolbar Content */}
        <div className="flex items-center gap-2">
            {/* Can show record count if needed, but image shows it in header */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-9 pr-4 py-2.5 bg-[#25282c] border border-gray-700 rounded-xl text-sm focus:ring-1 focus:ring-[#2E5E99] text-white placeholder-gray-500 shadow-inner outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 bg-[#25282c] border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl transition-all shadow-sm ${showFilters ? 'ring-2 ring-[#2E5E99]' : ''}`}
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto relative bg-[#1a1d21]">
        {isLoading && (
            <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        )}

        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#1a1d21] sticky top-0 z-20">
            <tr>
              {columns.map((col, idx) => (
                <th
                    key={idx}
                    className={`px-4 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 bg-[#1a1d21] ${col.sticky || ''}`}
                >
                    {col.header}
                </th>
              ))}
              <th className="px-4 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right sticky right-0 z-20 bg-[#1a1d21] border-b border-gray-800 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((profile, idx) => (
                <tr key={profile.id} className="hover:bg-[#25282c] transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td
                        key={colIdx}
                        className={`px-4 py-4 text-xs font-medium text-gray-300 bg-[#1a1d21] group-hover:bg-[#25282c] ${col.width || ''} ${col.sticky || ''}`}
                    >
                        {typeof col.accessor === 'function' ? col.accessor(profile, idx) : (profile[col.accessor] || "---")}
                    </td>
                  ))}

                  {/* ACTIONS COLUMN (Sticky Right) */}
                  <td className="px-4 py-3 text-right sticky right-0 z-10 bg-[#1a1d21] group-hover:bg-[#25282c] transition-colors border-l border-gray-800 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-end gap-1">
                       <button
                        onClick={() => onEdit && onEdit(profile.id)}
                        className="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(profile.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-20 text-center text-gray-500 text-sm">
                  {searchTerm ? `No profiles found matching "${searchTerm}"` : "No profiles added yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-gray-800 flex justify-between items-center bg-[#1a1d21]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Showing {paginatedProfiles.length} of {filteredProfiles.length} records
        </p>

        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-32 h-1 bg-gray-700 rounded-full self-center relative overflow-hidden">
             <div
               className="absolute top-0 left-0 h-full bg-gray-400 transition-all duration-300"
               style={{ width: `${(currentPage / (totalPages || 1)) * 100}%` }}
             ></div>
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}