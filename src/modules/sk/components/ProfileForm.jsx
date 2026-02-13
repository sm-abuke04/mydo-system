import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Loader2 } from "lucide-react";
import { ProfileService } from "../services/ProfileService";

// Helper for default form state
const INITIAL_STATE = {
  first_name: "", last_name: "", middle_name: "", suffix: "",
  skmt_no: "", email: "", contact_number: "",
  age: "", sex: "Male", birthdate: "", civil_status: "Single",
  barangay: "", purok: "", 
  youth_classification: "In School Youth",
  work_status: "Unemployed",
  is_voter: false,
  is_sk_voter: false
};

export default function ProfileForm() {
  const { id } = useParams(); // Check if we are in Edit Mode
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // FETCH DATA IF EDITING
  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const data = await ProfileService.getById(id);
          if (data) setFormData(data);
        } catch (error) {
          alert("Failed to load profile data.");
          navigate("/sk/list");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (id) {
        await ProfileService.update(id, formData);
        alert("Profile Updated Successfully!");
      } else {
        await ProfileService.create(formData);
        alert("New Profile Created!");
      }
      navigate("/sk/list");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 p-8 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white">
            {id ? "Edit Youth Profile" : "Registration Form"}
          </h2>
          <p className="text-[#7BA4D0] dark:text-gray-400 text-sm">
            Please fill in the information accurately.
          </p>
        </div>
        <button onClick={() => navigate("/sk/list")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: PERSONAL INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">First Name</label>
             <input required name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Middle Name</label>
             <input name="middle_name" value={formData.middle_name} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Last Name</label>
             <input required name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
           </div>
        </div>

        {/* SECTION 2: DEMOGRAPHICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Sex</label>
             <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
             </select>
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Age</label>
             <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Birthdate</label>
             <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Civil Status</label>
             <select name="civil_status" value={formData.civil_status} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
             </select>
           </div>
        </div>

        {/* SECTION 3: CLASSIFICATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Youth Classification</label>
             <select name="youth_classification" value={formData.youth_classification} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                <option value="In School Youth">In School Youth</option>
                <option value="Out of School Youth">Out of School Youth</option>
                <option value="Working Youth">Working Youth</option>
                <option value="Youth with Special Needs">Youth with Special Needs</option>
             </select>
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Work Status</label>
             <select name="work_status" value={formData.work_status} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                <option value="Unemployed">Unemployed</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
             </select>
           </div>
        </div>

        {/* SECTION 4: LOCATION & ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">SKMT Number</label>
             <input required name="skmt_no" value={formData.skmt_no} onChange={handleChange} placeholder="YYYY-NNN" className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Barangay</label>
             <input required name="barangay" value={formData.barangay} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-[#7BA4D0] uppercase">Purok</label>
             <input name="purok" value={formData.purok} onChange={handleChange} className="w-full p-3 bg-[#F8FAFC] dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white" />
           </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-6 flex justify-end gap-3">
           <button type="button" onClick={() => navigate("/sk/list")} className="px-6 py-3 rounded-xl font-bold text-[#7BA4D0] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
             Cancel
           </button>
           <button type="submit" disabled={isSaving} className="px-8 py-3 bg-[#2E5E99] hover:bg-[#0D2440] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">
             {isSaving ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5" />}
             {isSaving ? "Saving..." : "Save Profile"}
           </button>
        </div>
      </form>
    </div>
  );
}