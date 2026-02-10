import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Hooks
import { Save, XCircle } from 'lucide-react';
import ProfileSection from './ProfileSection';
import DemographicCards from './DemograhicCards';
import { INITIAL_FORM_STATE } from '../../views/src/data/Formconstants';

export default function ProfileForm({ profiles, onSubmit }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL (e.g. /edit/123)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Load data if editing
  useEffect(() => {
    if (id && profiles.length > 0) {
      const profileToEdit = profiles.find(p => p.id === parseInt(id));
      if (profileToEdit) {
        setFormData(profileToEdit);
      } else {
        // ID in URL not found? Redirect to list
        navigate('/list');
      }
    }
  }, [id, profiles, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      youthClassification: prev.youthClassification.includes(value)
        ? prev.youthClassification.filter(item => item !== value)
        : [...prev.youthClassification, value]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call App.jsx function
    navigate('/list'); // Go back to list after save
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-[#7BA4D0]/20">
      <div className="mb-6 pb-4 border-b border-[#E7F0FA] flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-[#0D2440]">
             {id ? 'Edit Youth Profile' : 'New Youth Profile'}
           </h2>
           <p className="text-[#2E5E99]">KK Survey Questionnaire - Confidential</p>
        </div>
        <button onClick={() => navigate('/list')} className="text-[#7BA4D0] hover:text-red-500 transition-colors">
           <XCircle className="w-8 h-8" />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        <ProfileSection formData={formData} handleInputChange={handleInputChange} />
        <DemographicCards 
          formData={formData} 
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
        />

        <div className="flex justify-end pt-6 border-t border-[#E7F0FA] gap-4">
          <button type="button" onClick={() => navigate('/list')} className="px-6 py-3 border border-[#7BA4D0] text-[#7BA4D0] font-bold rounded-xl hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button type="submit" className="px-8 py-3 bg-[#2E5E99] text-white font-bold rounded-xl hover:bg-[#0D2440] transition-all shadow-md flex items-center gap-2">
            <Save className="w-5 h-5" />
            {id ? 'Update Profile' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}