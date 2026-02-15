import React, { useState, useEffect } from "react";
import { Save, X, Loader2, ArrowLeft } from "lucide-react";
import { ProfileService } from "../services/ProfileService";
import {
  CIVIL_STATUS_OPTIONS,
  YOUTH_CLASSIFICATION_OPTIONS,
  YOUTH_AGE_GROUP_OPTIONS,
  WORK_STATUS_OPTIONS,
  EDUCATIONAL_BACKGROUND_OPTIONS,
  INITIAL_FORM_STATE
} from "../data/Form_Constants";

export default function ProfileForm({ id, onCancel, onSaveSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // FETCH DATA IF EDITING
  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const data = await ProfileService.getById(id);
          if (data) {
            setFormData(data);
          }
        } catch (error) {
          alert("Failed to load profile data.");
          if (onCancel) onCancel();
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
        setFormData(INITIAL_FORM_STATE);
    }
  }, [id]);

  // AGE CALCULATION EFFECT
  useEffect(() => {
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (formData.age !== age) {
        setFormData(prev => {
          const updates = { ...prev, age };
          if (age < 18) {
            updates.workStatus = "";
          }
          return updates;
        });
      }
    }
  }, [formData.birthday, formData.age]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleYouthClassificationChange = (option) => {
    setFormData(prev => {
      const current = prev.youthClassification || [];
      if (current.includes(option)) {
        return { ...prev, youthClassification: current.filter(item => item !== option) };
      } else {
        return { ...prev, youthClassification: [...current, option] };
      }
    });
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
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const isWorkStatusDisabled = !formData.age || formData.age < 18;

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 p-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#E7F0FA] dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white flex items-center gap-3">
            {onCancel && (
                <button onClick={onCancel} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Back to List">
                    <ArrowLeft size={24} className="text-[#2E5E99]" />
                </button>
            )}
            {id ? "Edit Youth Profile" : "Registration Form"}
          </h2>
          <p className="text-[#7BA4D0] dark:text-gray-400 text-sm pl-10">
            Please fill in the information accurately based on the KK Profile Form.
          </p>
        </div>
        {onCancel && (
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* SECTION 1: LOCATION (Matches columns 2-5: Region, Province, City, Barangay) */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
           <h3 className="text-sm font-black text-[#2E5E99] dark:text-blue-400 uppercase tracking-widest mb-4">I. Location Information</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">Region</label>
               <input disabled name="region" value={formData.region} className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg text-sm font-bold dark:text-gray-300 cursor-not-allowed" />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">Province</label>
               <input disabled name="province" value={formData.province} className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg text-sm font-bold dark:text-gray-300 cursor-not-allowed" />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">City / Municipality</label>
               <input disabled name="cityMunicipality" value={formData.cityMunicipality} className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg text-sm font-bold dark:text-gray-300 cursor-not-allowed" />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">Barangay</label>
               <input required name="barangay" value={formData.barangay} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
             </div>
           </div>
        </div>

        {/* SECTION 2: PERSONAL INFO (Matches Name, Age, Birthday, Sex, Civil Status) */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-black text-[#2E5E99] dark:text-blue-400 uppercase tracking-widest mb-4">II. Personal Information</h3>

          {/* SKMT NO - Column 1 */}
          <div className="grid grid-cols-1 gap-5 mb-5">
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">SKMT ID No.</label>
               <input required name="skmtNo" value={formData.skmtNo} onChange={handleChange} placeholder="YYYY-NNN" className="w-full md:w-1/3 p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">First Name</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Middle Name</label>
              <input name="middleName" value={formData.middleName} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Last Name</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Suffix</label>
              <input name="suffix" value={formData.suffix} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" placeholder="e.g. Jr, III" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                 <option value="">Select</option>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                readOnly
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 cursor-not-allowed"
                placeholder="Auto-calc"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Birthday</label>
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7BA4D0] uppercase">Civil Status</label>
              <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                 <option value="">Select Status</option>
                 {CIVIL_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: DEMOGRAPHICS (Matches Youth Class, Age Group, Educ, Work) */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
           <h3 className="text-sm font-black text-[#2E5E99] dark:text-blue-400 uppercase tracking-widest mb-4">III. Demographic Information</h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">Youth Age Group</label>
               <select name="youthAgeGroup" value={formData.youthAgeGroup} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                  <option value="">Select Age Group</option>
                  {YOUTH_AGE_GROUP_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">Highest Educational Attainment</label>
               <select name="educationalBackground" value={formData.educationalBackground} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white">
                  <option value="">Select Level</option>
                  {EDUCATIONAL_BACKGROUND_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
             <div className="space-y-2">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase block">Youth Classification (Select all that apply)</label>
               <div className="grid grid-cols-1 gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#E7F0FA] dark:border-gray-600">
                  {YOUTH_CLASSIFICATION_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.youthClassification?.includes(option)}
                            onChange={() => handleYouthClassificationChange(option)}
                            className="w-4 h-4 text-[#2E5E99] rounded border-gray-300 focus:ring-[#2E5E99]"
                        />
                        <span className="text-sm text-[#0D2440] dark:text-gray-200 font-medium">{option}</span>
                    </label>
                  ))}
               </div>
             </div>

             <div className="space-y-1">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">
                 Work Status {isWorkStatusDisabled && <span className="text-[10px] text-red-500 normal-case ml-1">(18+ only)</span>}
               </label>
               <select
                 name="workStatus"
                 value={formData.workStatus}
                 onChange={handleChange}
                 disabled={isWorkStatusDisabled}
                 className={`w-full p-3 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white transition-colors
                   ${isWorkStatusDisabled ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
                 `}
               >
                  <option value="">{isWorkStatusDisabled ? "N/A" : "Select Status"}</option>
                  {WORK_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
             </div>
           </div>
        </div>

        {/* SECTION 4: CONTACT & PUROK (Matches Email, Contact, Home Address) */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
           <h3 className="text-sm font-black text-[#2E5E99] dark:text-blue-400 uppercase tracking-widest mb-4">IV. Contact Information</h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="space-y-1">
                <label className="text-xs font-bold text-[#7BA4D0] uppercase">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-[#7BA4D0] uppercase">Contact Number</label>
                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold text-[#0D2440] dark:text-white focus:ring-2 focus:ring-[#2E5E99]" />
             </div>
             <div className="space-y-1 md:col-span-2">
               <label className="text-xs font-bold text-[#7BA4D0] uppercase">Purok / Zone (Home Address)</label>
               <input name="purokZone" value={formData.purokZone} onChange={handleChange} className="w-full p-3 bg-white dark:bg-gray-800 border border-[#E7F0FA] dark:border-gray-600 rounded-lg text-sm font-bold dark:text-white" />
             </div>
           </div>
        </div>

        <div className="flex gap-8 mt-6">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white dark:bg-gray-800 rounded-xl border border-[#E7F0FA] dark:border-gray-600 w-full hover:border-[#2E5E99] transition-all">
                <input
                    type="checkbox"
                    name="isSkVoter"
                    checked={formData.isSkVoter}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#2E5E99] rounded border-gray-300 focus:ring-[#2E5E99]"
                />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0D2440] dark:text-white">Registered SK Voter?</span>
                    <span className="text-xs text-[#7BA4D0]">Check if yes</span>
                </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white dark:bg-gray-800 rounded-xl border border-[#E7F0FA] dark:border-gray-600 w-full hover:border-[#2E5E99] transition-all">
                <input
                    type="checkbox"
                    name="isNationalVoter"
                    checked={formData.isNationalVoter}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#2E5E99] rounded border-gray-300 focus:ring-[#2E5E99]"
                />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0D2440] dark:text-white">Registered National Voter?</span>
                    <span className="text-xs text-[#7BA4D0]">Check if yes</span>
                </div>
            </label>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-6 flex justify-end gap-3">
           <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl font-bold text-[#7BA4D0] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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