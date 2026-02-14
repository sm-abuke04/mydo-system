import React, { useState, useEffect } from "react";
import { User, Shield, Edit2, Plus, Trash2, Loader2, Save, Calendar, Hash, Activity } from "lucide-react";
import { SKOfficialService } from "../services/SKOfficialService";
import { useAuth } from "../../../context/AuthContext";

export default function SKOfficials() {
  const { user } = useAuth(); // Get current logged in user
  const [officials, setOfficials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State: SKMT No., Name, Position, Birthdate, Age, Gender, Status
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
    } catch (error) {
      console.error("Failed to load officials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  // --- AGE CALCULATION EFFECT ---
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

  // --- AUTO-GENERATE SKMT NO (Mock) ---
  useEffect(() => {
    if (!editingId && !form.skmtNo) {
        const mockSKMT = `SK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        setForm(prev => ({ ...prev, skmtNo: mockSKMT }));
    }
  }, [editingId]);

  const handleSave = async () => {
    if (!form.name) return alert("Name is required");
    try {
      if (editingId) {
        await SKOfficialService.update(editingId, form);
      } else {
        await SKOfficialService.create(form);
      }
      // Reset Form
      setForm({
        skmtNo: "",
        name: "",
        position: "SK Kagawad",
        birthdate: "",
        age: "",
        gender: "Male",
        status: "Active"
      });
      setEditingId(null);
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

  const handleAddMyself = () => {
    if (user) {
        setForm(prev => ({
            ...prev,
            name: `${user.first_name} ${user.last_name}`,
            position: user.role === 'SK_CHAIR' ? 'SK Chairperson' : 'SK Official',
        }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: OFFICIALS LIST */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
            <Shield className="text-[#2E5E99]" /> Council Members
            </h2>
            <div className="text-xs text-[#7BA4D0] font-bold uppercase tracking-wider">
                {officials.length} Members
            </div>
        </div>

        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>
        ) : (
          <div className="grid gap-4">
             {officials.map((off) => (
               <div key={off.id} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-4 transition-all hover:shadow-md">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-[#2E5E99] dark:text-blue-400 border-2 border-white dark:border-gray-500 shadow-sm">
                     <User size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-[#0D2440] dark:text-white text-lg">{off.name}</h3>
                     <div className="flex flex-wrap gap-2 text-xs mt-1">
                        <span className="px-2 py-0.5 bg-[#E7F0FA] dark:bg-blue-900/30 text-[#2E5E99] dark:text-blue-300 rounded font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-800">
                            {off.position}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wide border ${
                            off.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                            {off.status || 'Active'}
                        </span>
                     </div>
                     <div className="text-xs text-gray-400 mt-1 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1"><Hash size={10}/> {off.skmtNo || off.skmt_no || '---'}</span>
                        <span className="flex items-center gap-1"><Calendar size={10}/> {off.age ? `${off.age} yrs` : 'N/A'}</span>
                        <span className="flex items-center gap-1">• {off.gender || 'N/A'}</span>
                     </div>
                   </div>
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                    <button onClick={() => handleEdit(off)} className="p-2 text-[#2E5E99] hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete(off.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remove"><Trash2 size={18}/></button>
                 </div>
               </div>
             ))}
             {officials.length === 0 && (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-400 italic mb-2">No officials added to the council yet.</p>
                    <button onClick={handleAddMyself} className="text-sm font-bold text-[#2E5E99] hover:underline">
                        Add myself as an official
                    </button>
                </div>
             )}
          </div>
        )}
      </div>

      {/* RIGHT: ADD/EDIT FORM */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 h-fit sticky top-6">
        <h3 className="font-bold text-[#0D2440] dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
          {editingId ? <Edit2 size={18} className="text-[#2E5E99]"/> : <Plus size={18} className="text-[#2E5E99]"/>}
          {editingId ? "Update Official" : "Add New Official"}
        </h3>
        
        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">SKMT No.</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                    <input
                    value={form.skmtNo}
                    readOnly
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-mono text-gray-500 cursor-not-allowed"
                    />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Status</label>
                <select
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="w-full p-2 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold dark:text-white"
                >
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
                <input
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#2E5E99] outline-none"
                placeholder="Hon. Juan Dela Cruz"
                />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Position</label>
             <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                <select
                value={form.position}
                onChange={(e) => setForm({...form, position: e.target.value})}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white outline-none"
                >
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
                <select
                    value={form.gender}
                    onChange={(e) => setForm({...form, gender: e.target.value})}
                    className="w-full p-2 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold dark:text-white outline-none"
                >
                    <option>Male</option>
                    <option>Female</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Age</label>
                <input
                    type="number"
                    value={form.age}
                    readOnly
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold text-gray-500 cursor-not-allowed"
                    placeholder="Auto"
                />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold text-[#7BA4D0] uppercase tracking-wider">Birthdate</label>
             <input
                type="date"
                value={form.birthdate}
                onChange={(e) => setForm({...form, birthdate: e.target.value})}
                className="w-full p-2 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-xs font-bold dark:text-white outline-none"
             />
          </div>
          
          <button onClick={handleSave} className="w-full py-3 mt-2 bg-[#2E5E99] hover:bg-[#0D2440] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center gap-2 active:scale-95">
             <Save size={18}/> {editingId ? "Save Changes" : "Add Official"}
          </button>
          
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({skmtNo:"", name:"", position:"SK Kagawad", birthdate:"", age:"", gender:"Male", status:"Active"}); }} className="w-full py-2 text-[#7BA4D0] text-xs font-bold hover:text-red-500 transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}