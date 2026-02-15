import React, { useState, useEffect } from "react";
import { User, Shield, Edit2, Plus, Trash2, Loader2, Save, Calendar, Hash, X } from "lucide-react";
import { SKOfficialService } from "../services/SKOfficialService";
import { useAuth } from "../../../context/AuthContext";

export default function SKOfficials() {
  const { user } = useAuth();
  const [officials, setOfficials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    skmtNo: "",
    name: "",
    position: "SK Kagawad",
    birthdate: "",
    age: "",
    gender: "Male",
    status: "Active"
  });

  const fetchOfficials = async () => {
    setIsLoading(true);
    try {
      const data = await SKOfficialService.getAll();
      setOfficials(data || []);

      // AUTO-ADD SK CHAIR if list is empty and user is SK_CHAIR
      if ((!data || data.length === 0) && user && user.role === 'SK_CHAIR') {
         await autoAddChair(user);
      }
    } catch (error) {
      console.error("Failed to load officials");
    } finally {
      setIsLoading(false);
    }
  };

  const autoAddChair = async (currentUser) => {
    try {
        const chairData = {
            skmtNo: `SK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            name: `${currentUser.first_name} ${currentUser.last_name}`,
            position: "SK Chairperson",
            birthdate: "", // User profile usually doesn't have bday, so leave blank to prompt edit later
            age: "",
            gender: "Male", // Default, editable
            status: "Active"
        };
        await SKOfficialService.create(chairData);
        // Refresh list
        const newData = await SKOfficialService.getAll();
        setOfficials(newData || []);
    } catch (err) {
        console.error("Failed to auto-add chair", err);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, [user]); // Run when user is loaded

  // --- AUTO-CALC AGE ---
  useEffect(() => {
    if (form.birthdate) {
      const birthDate = new Date(form.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setForm(prev => ({ ...prev, age }));
    }
  }, [form.birthdate]);

  // --- AUTO-GENERATE SKMT ---
  useEffect(() => {
    if (isModalOpen && !editingId && !form.skmtNo) {
        const mockSKMT = `SK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        setForm(prev => ({ ...prev, skmtNo: mockSKMT }));
    }
  }, [isModalOpen, editingId]);

  const handleSave = async () => {
    if (!form.name) return alert("Name is required");
    try {
      if (editingId) {
        await SKOfficialService.update(editingId, form);
      } else {
        await SKOfficialService.create(form);
      }
      handleCloseModal();
      fetchOfficials();
    } catch (error) {
      alert("Failed to save official");
    }
  };

  const handleEdit = (official) => {
    setForm({
        skmtNo: official.skmtNo || official.skmt_no || "",
        name: official.name,
        position: official.position,
        birthdate: official.birthdate || "",
        age: official.age || "",
        gender: official.gender || "Male",
        status: official.status || "Active"
    });
    setEditingId(official.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Remove this official?")) return;
    try {
      await SKOfficialService.delete(id);
      fetchOfficials();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
        skmtNo: "",
        name: "",
        position: "SK Kagawad",
        birthdate: "",
        age: "",
        gender: "Male",
        status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
        <div>
            <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
            <Shield className="text-[#2E5E99]" /> Council Members
            </h2>
            <p className="text-sm text-[#7BA4D0] dark:text-gray-400">Manage SK Officials and their roles</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100">
                {officials.length} Members
            </span>
            <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2E5E99] hover:bg-[#0D2440] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
                <Plus size={18} /> Add Official
            </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32}/></div>
      ) : (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 overflow-hidden">
            {officials.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                        <tr className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">
                            <th className="py-4 px-6">SKMT No.</th>
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">Position</th>
                            <th className="py-4 px-6">Info</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {officials.map((off) => (
                            <tr key={off.id} className="hover:bg-[#F8FAFC] dark:hover:bg-gray-700/30 transition-colors group">
                                <td className="py-4 px-6 text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                                    {off.skmtNo || '---'}
                                </td>
                                <td className="py-4 px-6 text-sm font-bold text-[#0D2440] dark:text-white">
                                    {off.name}
                                </td>
                                <td className="py-4 px-6">
                                    <span className="px-2 py-1 bg-[#E7F0FA] dark:bg-blue-900/30 text-[#2E5E99] dark:text-blue-300 rounded text-xs font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-800">
                                        {off.position}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="flex items-center gap-1"><Calendar size={10}/> {off.birthdate || 'No Bday'}</span>
                                        <span className="font-medium">{off.age ? `${off.age} yrs` : ''} • {off.gender || ''}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        off.status === 'Active'
                                        ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                                        : 'text-gray-500 bg-gray-50 dark:bg-gray-800'
                                    }`}>
                                        {off.status || 'Active'}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(off)} className="p-2 text-[#2E5E99] hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(off.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remove"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (
            <div className="text-center p-12">
                <p className="text-gray-400 italic mb-4">No officials found.</p>
                {/* Fallback button if auto-add fails or role is not chair */}
                <button onClick={handleOpenAdd} className="text-sm font-bold text-[#2E5E99] hover:underline">
                    Add First Official
                </button>
            </div>
            )}
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
                        {editingId ? <Edit2 size={18} className="text-[#2E5E99]"/> : <Plus size={18} className="text-[#2E5E99]"/>}
                        {editingId ? "Update Official" : "Add New Official"}
                    </h3>
                    <button onClick={handleCloseModal} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">SKMT No.</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                <input value={form.skmtNo} readOnly className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-mono text-gray-500 cursor-not-allowed" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Status</label>
                            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full p-2 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold dark:text-white">
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Resigned</option>
                                <option>Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#2E5E99] outline-none" placeholder="Hon. Juan Dela Cruz" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Position</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                            <select value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white outline-none">
                            <option>SK Chairperson</option>
                            <option>SK Kagawad</option>
                            <option>SK Secretary</option>
                            <option>SK Treasurer</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Gender</label>
                            <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})} className="w-full p-2 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold dark:text-white outline-none">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Age</label>
                            <input type="number" value={form.age} readOnly className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold text-gray-500 cursor-not-allowed" placeholder="Auto" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Birthdate</label>
                        <input type="date" value={form.birthdate} onChange={(e) => setForm({...form, birthdate: e.target.value})} className="w-full p-2 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold dark:text-white outline-none" />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button onClick={handleCloseModal} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="flex-1 py-3 bg-[#2E5E99] hover:bg-[#0D2440] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center gap-2 active:scale-95">
                            <Save size={18}/> {editingId ? "Save" : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}