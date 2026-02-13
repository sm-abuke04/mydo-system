import React, { useState, useEffect } from "react";
import { User, Shield, Edit2, Plus, Trash2, Loader2, Save } from "lucide-react";
import { SKOfficialService } from "../services/SKOfficialService";

export default function SKOfficials() {
  const [officials, setOfficials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [form, setForm] = useState({ name: "", position: "SK Kagawad" });

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

  const handleSave = async () => {
    if (!form.name) return alert("Name is required");
    try {
      if (editingId) {
        await SKOfficialService.update(editingId, form);
      } else {
        await SKOfficialService.create(form);
      }
      setForm({ name: "", position: "SK Kagawad" });
      setEditingId(null);
      fetchOfficials();
    } catch (error) {
      alert("Failed to save official");
    }
  };

  const handleEdit = (official) => {
    setForm({ name: official.name, position: official.position });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: OFFICIALS LIST */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
          <Shield className="text-[#2E5E99]" /> Council Members
        </h2>

        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>
        ) : (
          <div className="grid gap-4">
             {officials.map((off) => (
               <div key={off.id} className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 flex justify-between items-center group">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-[#2E5E99] dark:text-blue-400">
                     <User />
                   </div>
                   <div>
                     <h3 className="font-bold text-[#0D2440] dark:text-white text-lg">{off.name}</h3>
                     <p className="text-xs font-bold text-[#7BA4D0] uppercase tracking-wide">{off.position}</p>
                   </div>
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(off)} className="p-2 text-[#2E5E99] hover:bg-blue-50 rounded-lg"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete(off.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                 </div>
               </div>
             ))}
             {officials.length === 0 && <p className="text-gray-400 italic">No officials added yet.</p>}
          </div>
        )}
      </div>

      {/* RIGHT: ADD/EDIT FORM */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 h-fit">
        <h3 className="font-bold text-[#0D2440] dark:text-white mb-6 flex items-center gap-2">
          {editingId ? <Edit2 size={18}/> : <Plus size={18}/>}
          {editingId ? "Update Official" : "Add New Official"}
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Full Name</label>
             <input 
               value={form.name}
               onChange={(e) => setForm({...form, name: e.target.value})}
               className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-[#2E5E99]"
               placeholder="Hon. Juan Dela Cruz"
             />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Position</label>
             <select 
               value={form.position}
               onChange={(e) => setForm({...form, position: e.target.value})}
               className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-xl font-bold dark:text-white"
             >
               <option>SK Chairperson</option>
               <option>SK Kagawad</option>
               <option>SK Secretary</option>
               <option>SK Treasurer</option>
             </select>
          </div>
          
          <button onClick={handleSave} className="w-full py-3 bg-[#2E5E99] hover:bg-[#0D2440] text-white rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2">
             <Save size={18}/> {editingId ? "Save Changes" : "Add Official"}
          </button>
          
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({name:"", position:"SK Kagawad"}); }} className="w-full py-2 text-[#7BA4D0] font-bold hover:text-red-500">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}