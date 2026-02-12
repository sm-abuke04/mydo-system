import React, { useEffect } from 'react';
import { User, MapPin } from 'lucide-react';

export default function ProfileSection({ formData, handleInputChange }) {
  const inputClass = "w-full px-4 py-2 border border-[#7BA4D0] rounded-lg focus:ring-2 focus:ring-[#2E5E99] focus:border-[#2E5E99] outline-none transition-all placeholder-[#7BA4D0]/70 text-[#0D2440]";
  const labelClass = "block text-sm font-semibold text-[#0D2440] mb-2";

  // AUTO-CALCULATE AGE and GROUP
  // We hook into the change event manually to update related fields
  const handleDateChange = (e) => {
    handleInputChange(e); // Update birthday first
    
    const birthDate = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Synthesize an event to update age
    handleInputChange({ target: { name: 'age', value: age } });

    // Auto-set Age Group
    let group = '';
    if (age >= 15 && age <= 17) group = 'Child Youth (15-17 yrs old)';
    else if (age >= 18 && age <= 24) group = 'Core Youth (18-24 yrs old)';
    else if (age >= 25 && age <= 30) group = 'Young Adult (25-30 yrs old)';
    
    handleInputChange({ target: { name: 'youthAgeGroup', value: group } });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#2E5E99]">
        <User className="w-5 h-5 text-[#2E5E99]" />
        <h3 className="text-xl font-bold text-[#0D2440]">I. PROFILE</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Name of Respondent</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required className={inputClass} />
            <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Middle Name" className={inputClass} />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" required className={inputClass} />
            <input type="text" name="suffix" value={formData.suffix} onChange={handleInputChange} placeholder="Suffix" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1 text-[#2E5E99]" /> Location</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input type="text" name="region" value={formData.region} onChange={handleInputChange} placeholder="Region" required className={inputClass} />
            <input type="text" name="province" value={formData.province} onChange={handleInputChange} placeholder="Province" required className={inputClass} />
            <input type="text" name="cityMunicipality" value={formData.cityMunicipality} onChange={handleInputChange} placeholder="City/Mun." required className={inputClass} />
            <input type="text" name="barangay" value={formData.barangay} onChange={handleInputChange} placeholder="Barangay" required className={inputClass} />
            <input type="text" name="purokZone" value={formData.purokZone} onChange={handleInputChange} placeholder="Purok" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Birthday</label>
            <input type="date" name="birthday" value={formData.birthday} onChange={handleDateChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Age (Auto-calculated)</label>
            <input type="number" name="age" value={formData.age} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed`} />
          </div>
          <div>
            <label className={labelClass}>Sex Assigned by Birth</label>
            <select name="sex" value={formData.sex} onChange={handleInputChange} required className={inputClass}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Contact Number</label>
            <input type="tel" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="09XX XXX XXXX" required className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}