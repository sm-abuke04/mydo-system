import React from 'react';
import { Users, Briefcase, GraduationCap, Vote, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { 
  CIVIL_STATUS_OPTIONS, 
  YOUTH_CLASSIFICATION_OPTIONS, 
  YOUTH_AGE_GROUP_OPTIONS, 
  WORK_STATUS_OPTIONS, 
  EDUCATIONAL_BACKGROUND_OPTIONS 
} from '../data/Form_Constants'; // Updated import path for constants

export default function DemographicCards({ formData, handleInputChange, handleCheckboxChange }) {
  const cardStyle = "bg-white rounded-xl p-6 border border-[#7BA4D0]/40 shadow-sm hover:shadow-md transition-shadow hover:border-[#2E5E99] h-full flex flex-col";
  const labelStyle = "block text-lg font-bold text-[#0D2440] mb-4 flex items-center gap-2";
  const optionStyle = "flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-[#E7F0FA] transition-colors";

  // LOGIC: Parse age to determine if eligible for work status
  const currentAge = parseInt(formData.age) || 0;
  const isWorkingAge = currentAge >= 18;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 border-b-2 border-[#2E5E99] pb-2">
        <Users className="w-5 h-5 text-[#2E5E99]" />
        <h3 className="text-xl font-bold text-[#0D2440]">II. DEMOGRAPHIC CHARACTERISTICS</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Civil Status */}
        <div className={cardStyle}>
          <label className={labelStyle}>Civil Status</label>
          <div className="grid grid-cols-2 gap-3">
            {CIVIL_STATUS_OPTIONS.map(status => (
              <label key={status} className={optionStyle}>
                <input type="radio" name="civilStatus" value={status} checked={formData.civilStatus === status} onChange={handleInputChange} className="w-4 h-4 text-[#2E5E99] focus:ring-[#2E5E99]" />
                <span className="text-sm text-[#0D2440] font-medium">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Youth Age Group (Read Only - Auto Calculated) */}
        <div className={cardStyle}>
          <label className={labelStyle}>Youth Age Group <span className="text-xs font-normal ml-2 text-gray-500">(Auto-set)</span></label>
          <div className="space-y-3">
            {YOUTH_AGE_GROUP_OPTIONS.map(group => (
              <label key={group.value} className={`${optionStyle} ${formData.youthAgeGroup !== group.value ? 'opacity-50' : ''}`}>
                <input type="radio" name="youthAgeGroup" value={group.value} checked={formData.youthAgeGroup === group.value} readOnly className="w-4 h-4 text-[#2E5E99]" />
                <span className="text-sm text-[#0D2440] font-medium">{group.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Voter Status */}
        <div className={cardStyle}>
          <label className={labelStyle}>
            <Vote className="w-5 h-5 text-[#2E5E99]" />
            Voter Registration Status
          </label>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-[#0D2440]">Registered SK Voter?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isSkVoter" checked={formData.isSkVoter} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E5E99]"></div>
                </label>
             </div>
             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-[#0D2440]">Registered National Voter?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isNationalVoter" checked={formData.isNationalVoter} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E5E99]"></div>
                </label>
             </div>
          </div>
        </div>

        {/* --- WORK STATUS (UPDATED LOGIC) --- */}
        <div className={`${cardStyle} relative ${!isWorkingAge ? 'bg-gray-50' : ''}`}>
          <label className={`${labelStyle} ${!isWorkingAge ? 'text-gray-400' : ''}`}>
            <Briefcase className={`w-5 h-5 ${!isWorkingAge ? 'text-gray-400' : 'text-[#2E5E99]'}`} /> 
            Work Status
          </label>
          
          <div className={`space-y-3 flex-1 ${!isWorkingAge ? 'opacity-40 pointer-events-none' : ''}`}>
            {WORK_STATUS_OPTIONS.map(status => (
              <label key={status} className={optionStyle}>
                <input 
                  type="radio" 
                  name="workStatus" 
                  value={status} 
                  checked={formData.workStatus === status} 
                  onChange={handleInputChange} 
                  disabled={!isWorkingAge} 
                  className="w-4 h-4 text-[#2E5E99] focus:ring-[#2E5E99]" 
                />
                <span className="text-sm text-[#0D2440] font-medium">{status}</span>
              </label>
            ))}
          </div>

          {/* Logic Message */}
          {!isWorkingAge && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Age Restriction</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Work status profiling is only applicable for <strong>Core Youth & Young Adults</strong> (18 years old and above).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Educational Background */}
        <div className={`${cardStyle} lg:col-span-2`}>
          <label className={labelStyle}><GraduationCap className="w-5 h-5 text-[#2E5E99]" /> Educational Background</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EDUCATIONAL_BACKGROUND_OPTIONS.map(edu => (
              <label key={edu} className={optionStyle}>
                <input type="radio" name="educationalBackground" value={edu} checked={formData.educationalBackground === edu} onChange={handleInputChange} className="w-4 h-4 text-[#2E5E99] focus:ring-[#2E5E99]" />
                <span className="text-sm text-[#0D2440] font-medium">{edu}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Youth Classification */}
        <div className={`${cardStyle} lg:col-span-2`}>
          <label className={labelStyle}>
            Youth Classification <span className="text-sm font-normal text-[#7BA4D0] ml-2">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {YOUTH_CLASSIFICATION_OPTIONS.map(classification => (
              <label key={classification} className={optionStyle}>
                <input type="checkbox" checked={formData.youthClassification.includes(classification)} onChange={() => handleCheckboxChange(classification)} className="w-4 h-4 text-[#2E5E99] focus:ring-[#2E5E99] rounded" />
                <span className="text-sm text-[#0D2440] font-medium">{classification}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}