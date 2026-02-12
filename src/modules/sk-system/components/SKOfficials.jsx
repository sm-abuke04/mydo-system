import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  User,
} from "lucide-react";
import { SKOfficialService } from "../services/SKOfficialService"; // Importing the service for API calls

export default function SKOfficials() {
  const [officials, setOfficials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "SK Kagawad",
    barangay: "",
    contact: "",
    status: "Active",
  });

  // Fetch Data
  const fetchOfficials = async () => {
    setIsLoading(true);
    try {
      const data = await SKOfficialService.getAll();
      setOfficials(data);
    } catch (error) {
      console.error("Failed to load officials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  // Form Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentId) {
        await SKOfficialService.update(currentId, formData);
        alert("Official Updated Successfully");
      } else {
        await SKOfficialService.create(formData);
        alert("Official Added Successfully");
      }
      setIsModalOpen(false);
      fetchOfficials();
      resetForm();
    } catch (error) {
      alert("Error saving data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this official?"))
      return;
    try {
      await SKOfficialService.delete(id);
      fetchOfficials();
    } catch (error) {
      alert("Error deleting official");
    }
  };

  const openEdit = (official) => {
    setFormData(official);
    setCurrentId(official.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      position: "SK Kagawad",
      barangay: "",
      contact: "",
      status: "Active",
    });
    setCurrentId(null);
  };

  // Filter Logic
  const filteredOfficials = officials.filter((off) => {
    const matchesSearch = (off.firstName + " " + off.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBarangay =
      filterBarangay === "All" || off.barangay === filterBarangay;
    return matchesSearch && matchesBarangay;
  });

  const barangayList = [...new Set(officials.map((o) => o.barangay))];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-[#E7F0FA] dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#2E5E99] dark:text-blue-400" />
            SK Officials Directory
          </h2>
          <p className="text-sm text-[#7BA4D0] dark:text-gray-400">
            Manage SK Chairpersons, Kagawads, and Appointed Officials
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E5E99] text-white rounded-lg hover:bg-[#0D2440] transition-colors shadow-md font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> Add Official
        </button>
      </div>

      {/* FILTERS */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4 border-b border-[#E7F0FA] dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search officials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#0D2440] dark:text-white text-sm focus:ring-2 focus:ring-[#2E5E99] outline-none"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={filterBarangay}
            onChange={(e) => setFilterBarangay(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#0D2440] dark:text-white text-sm focus:ring-2 focus:ring-[#2E5E99] outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Barangays</option>
            {barangayList.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOfficials.map((official) => (
            <div
              key={official.id}
              className="bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2E5E99] to-[#0D2440] flex items-center justify-center text-white font-bold text-lg">
                    {official.firstName[0]}
                    {official.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D2440] dark:text-white">
                      {official.firstName} {official.lastName}
                    </h3>
                    <p className="text-xs text-[#2E5E99] dark:text-blue-400 font-bold uppercase">
                      {official.position}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> {official.barangay}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${official.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700"}`}
                >
                  {official.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => openEdit(official)}
                  className="flex-1 py-1.5 text-xs font-bold text-[#2E5E99] dark:text-blue-300 bg-[#E7F0FA] dark:bg-gray-700 rounded hover:bg-[#2E5E99] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(official.id)}
                  className="flex-1 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-600 hover:text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOfficials.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No officials found.
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E7F0FA] dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#0D2440] dark:text-white">
                {currentId ? "Edit Official" : "Add New Official"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-[#0D2440] dark:text-white text-sm focus:ring-2 focus:ring-[#2E5E99] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-[#0D2440] dark:text-white text-sm focus:ring-2 focus:ring-[#2E5E99] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-[#0D2440] dark:text-white text-sm focus:ring-2 focus:ring-[#2E5E99] outline-none"
                >
                  <option>SK Chairperson</option>
                  <option>SK Kagawad</option>
                  <option>SK Secretary</option>
                  <option>SK Treasurer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Barangay
                </label>
                <input
                  required
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  placeholder="Enter Barangay"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-[#0D2440] dark:text-white text-sm focus:ring-2 focus:ring-[#2E5E99] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E5E99] text-white text-sm font-bold rounded-lg hover:bg-[#0D2440] shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Official
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
