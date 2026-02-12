import React from 'react';
import { Printer } from 'lucide-react';
// import SKLogo from '../assets/sk-logo.png'; 
// import BagongPilipinasLogo from '../assets/bagong-pilipinas.png'; 

const SKLogo = null; // Replace with actual import path
const BagongPilipinasLogo = null; // Replace with actual import path

export default function PrintableReport({ profiles }) {
  
  // --- DATA AGGREGATION HELPERS ---
  const getAge = (p) => parseInt(p.age) || 0;
  
  const countAttr = (attr, value, minAge, maxAge) => {
    return profiles.filter(p => {
      const age = getAge(p);
      const val = p[attr];
      const match = Array.isArray(val) ? val.includes(value) : val === value;
      return age >= minAge && age <= maxAge && match;
    }).length;
  };

  const countSexAge = (sex, age) => profiles.filter(p => p.sex === sex && getAge(p) === age).length;
  
  const countSexRange = (sex, min, max) => profiles.filter(p => {
    const age = getAge(p);
    return p.sex === sex && age >= min && age <= max;
  }).length;

  const totalProfiles = profiles.length;

  const ageGroups = [
    { label: '15-17', min: 15, max: 17 },
    { label: '18-24', min: 18, max: 24 },
    { label: '25-30', min: 25, max: 30 },
  ];

  return (
    // FIX: min-w-fit ensures the div expands to hold the 8.5in paper, triggering scroll on parent
    <div className="flex flex-col items-center justify-start min-h-full w-full min-w-fit bg-gray-100 pb-10 pt-8">
      
      {/* --- PRINT CSS CONFIGURATION (FOLIO / LONG BOND PAPER) --- 
          Folio Size: 8.5 inches x 13 inches
      */}
      <style>{`
        @media print {
          @page { 
            size: 8.5in 13in; 
            margin: 0.5in; 
          }
          body, #root, .flex-col, .h-screen, main, .overflow-y-auto, .overflow-hidden, .overflow-auto {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            display: block !important;
          }
          /* Hide Sidebar, Header, and Action Bar when printing */
          nav, header, button, .print\\:hidden { 
            display: none !important; 
          }
        }
      `}</style>

      {/* --- ACTION BAR (Screen Only) --- */}
      {/* FIX: Width set to 8.5in to match paper width */}
      <div className="w-[8.5in] mb-4 flex justify-between items-center print:hidden px-1">
        <div>
          <h2 className="text-lg font-bold text-gray-800">KK Profile Summary</h2>
          <p className="text-sm text-gray-500">Official Format • Folio (8.5" x 13")</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2 bg-[#2E5E99] text-white font-bold rounded-lg hover:bg-[#0D2440] shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* --- DOCUMENT PAGE (FOLIO SIZE) --- */}
      {/* Width: 8.5in | Height: 13in */}
      <div className="bg-white w-[8.5in] min-h-[13in] p-[0.5in] shadow-2xl text-black font-serif text-[10pt] leading-snug print:w-full print:shadow-none print:p-0 box-border">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-24 flex justify-center pt-2">
             {/* Replace with actual Bagong Pilipinas Logo */}
             {BagongPilipinasLogo && <img src={BagongPilipinasLogo} alt="Bagong Pilipinas" className="w-20 h-20 object-contain" />}
          </div>
          <div className="text-center flex-1">
            <p>Republic of the Philippines</p>
            <p>Province of Northern Samar</p>
            <p>Municipality of Catarman</p>
            <p className="font-bold mt-2">BARANGAY ________________</p>
            <p className="mt-1 font-bold">-o0o-</p>
            <h1 className="font-bold text-base uppercase mt-2 font-sans">Office of the Sangguniang Kabataan</h1>
          </div>
          <div className="w-24 flex justify-center pt-2">
            {SKLogo && <img src={SKLogo} alt="SK Logo" className="w-20 h-20 object-contain" />}
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="font-bold uppercase underline text-sm font-sans">SUMMARY OF KATIPUNAN NG KABATAAN PROFILE</h2>
          <p className="italic mt-1">as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* I. OVERVIEW */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">OVERVIEW</h3>
          <table className="w-full border-collapse border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 w-3/4">Total No. of Profiled KK Members</td>
                <td className="border border-black px-2 py-1 text-center font-bold">{totalProfiles}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Total No. of KK Members who Refused to sign the KK Profile</td>
                <td className="border border-black px-2 py-1 text-center">0</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Total No. of Out-of-Town KK Members</td>
                <td className="border border-black px-2 py-1 text-center">0</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold bg-gray-200 print:bg-gray-200">TOTAL</td>
                <td className="border border-black px-2 py-1 text-center font-bold bg-gray-200 print:bg-gray-200">{totalProfiles}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* II. AGE GROUP AND SEX */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">AGE GROUP AND SEX ASSIGNED AT BIRTH</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-2 py-1 text-left">SEX</th>
                <th className="border border-black px-2 py-1">15-17</th>
                <th className="border border-black px-2 py-1">18-24</th>
                <th className="border border-black px-2 py-1">25-30</th>
                <th className="border border-black px-2 py-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 text-left">Male</td>
                <td className="border border-black">{countSexRange('Male', 15, 17)}</td>
                <td className="border border-black">{countSexRange('Male', 18, 24)}</td>
                <td className="border border-black">{countSexRange('Male', 25, 30)}</td>
                <td className="border border-black font-bold">{profiles.filter(p => p.sex === 'Male').length}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 text-left">Female</td>
                <td className="border border-black">{countSexRange('Female', 15, 17)}</td>
                <td className="border border-black">{countSexRange('Female', 18, 24)}</td>
                <td className="border border-black">{countSexRange('Female', 25, 30)}</td>
                <td className="border border-black font-bold">{profiles.filter(p => p.sex === 'Female').length}</td>
              </tr>
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-2 py-1 text-left">TOTAL</td>
                <td className="border border-black">{profiles.filter(p => { const a = getAge(p); return a >= 15 && a <= 17; }).length}</td>
                <td className="border border-black">{profiles.filter(p => { const a = getAge(p); return a >= 18 && a <= 24; }).length}</td>
                <td className="border border-black">{profiles.filter(p => { const a = getAge(p); return a >= 25 && a <= 30; }).length}</td>
                <td className="border border-black">{totalProfiles}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* III. CHILD YOUTH */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">CHILD YOUTH</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-2 py-1 text-left">SEX</th>
                <th className="border border-black px-2 py-1">15</th>
                <th className="border border-black px-2 py-1">16</th>
                <th className="border border-black px-2 py-1">17</th>
                <th className="border border-black px-2 py-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 text-left">Male</td>
                {[15,16,17].map(age => <td key={age} className="border border-black">{countSexAge('Male', age)}</td>)}
                <td className="border border-black font-bold">{countSexRange('Male', 15, 17)}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 text-left">Female</td>
                {[15,16,17].map(age => <td key={age} className="border border-black">{countSexAge('Female', age)}</td>)}
                <td className="border border-black font-bold">{countSexRange('Female', 15, 17)}</td>
              </tr>
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-2 py-1 text-left">TOTAL</td>
                {[15,16,17].map(age => <td key={age} className="border border-black">{profiles.filter(p => getAge(p) === age).length}</td>)}
                <td className="border border-black">{profiles.filter(p => { const a = getAge(p); return a >= 15 && a <= 17; }).length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* IV. CORE YOUTH */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">CORE YOUTH</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-1 py-1 text-left">SEX</th>
                {[18,19,20,21,22,23,24].map(age => <th key={age} className="border border-black px-1">{age}</th>)}
                <th className="border border-black px-1 py-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 py-1 text-left">Male</td>
                {[18,19,20,21,22,23,24].map(age => <td key={age} className="border border-black">{countSexAge('Male', age)}</td>)}
                <td className="border border-black font-bold">{countSexRange('Male', 18, 24)}</td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-1 text-left">Female</td>
                {[18,19,20,21,22,23,24].map(age => <td key={age} className="border border-black">{countSexAge('Female', age)}</td>)}
                <td className="border border-black font-bold">{countSexRange('Female', 18, 24)}</td>
              </tr>
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-1 py-1 text-left">TOTAL</td>
                {[18,19,20,21,22,23,24].map(age => <td key={age} className="border border-black">{profiles.filter(p => getAge(p) === age).length}</td>)}
                <td className="border border-black">{profiles.filter(p => { const a = getAge(p); return a >= 18 && a <= 24; }).length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* V. YOUNG ADULT */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">YOUNG ADULT</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-1 py-1 text-left">SEX</th>
                {[25,26,27,28,29,30].map(age => <th key={age} className="border border-black px-1">{age}</th>)}
                <th className="border border-black px-1 py-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 py-1 text-left">Male</td>
                {[25,26,27,28,29,30].map(age => <td key={age} className="border border-black">{countSexAge('Male', age)}</td>)}
                <td className="border border-black font-bold">{countSexRange('Male', 25, 30)}</td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-1 text-left">Female</td>
                {[25,26,27,28,29,30].map(age => <td key={age} className="border border-black">{countSexAge('Female', age)}</td>)}
                <td className="border border-black font-bold">{countSexRange('Female', 25, 30)}</td>
              </tr>
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-1 py-1 text-left">TOTAL</td>
                {[25,26,27,28,29,30].map(age => <td key={age} className="border border-black">{profiles.filter(p => getAge(p) === age).length}</td>)}
                <td className="border border-black">{profiles.filter(p => { const a = getAge(p); return a >= 25 && a <= 30; }).length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Page Break for Print safety */}
        <div className="print:break-inside-avoid"></div>

        {/* VI. CIVIL STATUS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">CIVIL STATUS</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-1 py-1 text-left">AGE</th>
                {['Single', 'Married', 'Widowed', 'Divorced', 'Separated', 'Annulled', 'Live-in', 'Unknown'].map(h => 
                  <th key={h} className="border border-black px-1">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {ageGroups.map(group => (
                <tr key={group.label}>
                  <td className="border border-black px-1 py-1 text-left">{group.label}</td>
                  {['Single', 'Married', 'Widowed', 'Divorced', 'Separated', 'Annulled', 'Live-in', 'Unknown'].map(status => (
                    <td key={status} className="border border-black">{countAttr('civilStatus', status, group.min, group.max)}</td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-1 py-1 text-left">TOTAL</td>
                {['Single', 'Married', 'Widowed', 'Divorced', 'Separated', 'Annulled', 'Live-in', 'Unknown'].map(status => (
                  <td key={status} className="border border-black">{profiles.filter(p => p.civilStatus === status).length}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* VII. EDUCATIONAL BACKGROUND */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">EDUCATIONAL BACKGROUND</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-2 py-1 text-left">EDUCATIONAL BACKGROUND</th>
                <th className="border border-black">15-17</th>
                <th className="border border-black">18-24</th>
                <th className="border border-black">25-30</th>
                <th className="border border-black">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Elementary Level', 'Elementary Grad', 'High School Level', 'High School Grad',
                'Vocational Grad', 'College Level', 'College Grad', 'Masters Level', 
                'Masters Grad', 'Doctorate Level', 'Doctorate Grad'
              ].map(edu => (
                <tr key={edu}>
                  <td className="border border-black px-2 py-1 text-left">{edu}</td>
                  {ageGroups.map(group => (
                    <td key={group.label} className="border border-black">{countAttr('educationalBackground', edu, group.min, group.max)}</td>
                  ))}
                  <td className="border border-black font-bold">{profiles.filter(p => p.educationalBackground === edu).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIII. YOUTH CLASSIFICATION */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">YOUTH CLASSIFICATION</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th rowSpan="2" className="border border-black px-2 py-1 text-left align-middle">AGE GROUP</th>
                <th colSpan="4" className="border border-black px-1">CLASSIFICATION</th>
                <th colSpan="3" className="border border-black px-1">YOUTH WITH SPECIFIC NEEDS</th>
              </tr>
              <tr className="bg-gray-100 print:bg-gray-100 text-[9px]">
                <th className="border border-black">In-School</th>
                <th className="border border-black">Out-of-School</th>
                <th className="border border-black">Working</th>
                <th className="border border-black">Specific Needs</th>
                <th className="border border-black">PWD</th>
                <th className="border border-black">CICL</th>
                <th className="border border-black">IP</th>
              </tr>
            </thead>
            <tbody>
              {ageGroups.map(group => (
                <tr key={group.label}>
                  <td className="border border-black px-2 py-1 text-left">{group.label}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'In School Youth', group.min, group.max)}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'Out of School Youth', group.min, group.max)}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'Working Youth', group.min, group.max)}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'Youth with Specific Needs', group.min, group.max)}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'Person with Disability', group.min, group.max)}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'Children in Conflict with Law', group.min, group.max)}</td>
                  <td className="border border-black">{countAttr('youthClassification', 'Indigenous People', group.min, group.max)}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-2 py-1 text-left">TOTAL</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('In School Youth')).length}</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('Out of School Youth')).length}</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('Working Youth')).length}</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('Youth with Specific Needs')).length}</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('Person with Disability')).length}</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('Children in Conflict with Law')).length}</td>
                <td className="border border-black">{profiles.filter(p => p.youthClassification.includes('Indigenous People')).length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* IX. WORK STATUS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold uppercase mb-1 font-sans text-xs">WORK STATUS</h3>
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-black px-2 py-1 text-left">AGE GROUP</th>
                <th className="border border-black">Employed</th>
                <th className="border border-black">Unemployed</th>
                <th className="border border-black">Self-employed</th>
                <th className="border border-black">Looking for Job</th>
                <th className="border border-black">Not Interested</th>
              </tr>
            </thead>
            <tbody>
              {ageGroups.map(group => (
                <tr key={group.label}>
                  <td className="border border-black px-2 py-1 text-left">{group.label}</td>
                  {['Employed', 'Unemployed', 'Self-employed', 'Currently Looking for a Job', 'Not Interested Looking for a Job'].map(status => (
                    <td key={status} className="border border-black">{countAttr('workStatus', status, group.min, group.max)}</td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                <td className="border border-black px-2 py-1 text-left">TOTAL</td>
                {['Employed', 'Unemployed', 'Self-employed', 'Currently Looking for a Job', 'Not Interested Looking for a Job'].map(status => (
                    <td key={status} className="border border-black">{profiles.filter(p => p.workStatus === status).length}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="print:break-before-page"></div>

        {/* X. & XI. VOTER STATUS */}
        <div className="grid grid-cols-2 gap-4 mb-6 break-inside-avoid">
          <div>
             <h3 className="font-bold uppercase mb-1 font-sans text-xs">REGISTERED SK VOTER</h3>
             <table className="w-full border-collapse border border-black text-center text-xs">
               <thead>
                 <tr className="bg-gray-100 print:bg-gray-100">
                   <th className="border border-black px-2 py-1 text-left">AGE GROUP</th>
                   <th className="border border-black">Registered</th>
                   <th className="border border-black">Not Registered</th>
                 </tr>
               </thead>
               <tbody>
                  {ageGroups.map(group => (
                    <tr key={group.label}>
                      <td className="border border-black px-2 py-1 text-left">{group.label}</td>
                      <td className="border border-black">{countAttr('isSkVoter', true, group.min, group.max)}</td>
                      <td className="border border-black">{countAttr('isSkVoter', false, group.min, group.max)}</td>
                    </tr>
                  ))}
                   <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                      <td className="border border-black px-2 py-1 text-left">TOTAL</td>
                      <td className="border border-black">{profiles.filter(p => p.isSkVoter === true).length}</td>
                      <td className="border border-black">{profiles.filter(p => p.isSkVoter !== true).length}</td>
                   </tr>
               </tbody>
             </table>
          </div>

          <div>
             <h3 className="font-bold uppercase mb-1 font-sans text-xs">REGISTERED REGULAR VOTER</h3>
             <table className="w-full border-collapse border border-black text-center text-xs">
               <thead>
                 <tr className="bg-gray-100 print:bg-gray-100">
                   <th className="border border-black px-2 py-1 text-left">AGE GROUP</th>
                   <th className="border border-black">Registered</th>
                   <th className="border border-black">Not Registered</th>
                 </tr>
               </thead>
               <tbody>
                  {ageGroups.slice(1).map(group => (
                    <tr key={group.label}>
                      <td className="border border-black px-2 py-1 text-left">{group.label}</td>
                      <td className="border border-black">{countAttr('isNationalVoter', true, group.min, group.max)}</td>
                      <td className="border border-black">{countAttr('isNationalVoter', false, group.min, group.max)}</td>
                    </tr>
                  ))}
                   <tr className="bg-gray-200 print:bg-gray-200 font-bold">
                      <td className="border border-black px-2 py-1 text-left">TOTAL</td>
                      <td className="border border-black">{profiles.filter(p => p.isNationalVoter === true).length}</td>
                      <td className="border border-black">{profiles.filter(p => p.isNationalVoter !== true).length}</td>
                   </tr>
               </tbody>
             </table>
          </div>
        </div>

        {/* SIGNATORIES */}
        <div className="mt-8 break-inside-avoid">
           <p className="mb-4 text-sm">I HEREBY CERTIFY that the information provided in this form is complete, true and correct to the best of my knowledge.</p>
           
           <div className="grid grid-cols-2 gap-16 text-sm">
             <div>
                 <div className="border-b border-black w-3/4 mb-1 mt-20"></div>
                 <p className="font-bold uppercase">SK Secretary</p>
             </div>
             <div>
                 <p className="mb-4 italic">Noted and Approved for Submission:</p>
                 <div className="border-b border-black w-3/4 mb-1 mt-16"></div>
                 <p className="font-bold uppercase">SK Chairperson</p>
             </div>
           </div>

           <div className="mt-8 text-sm">
              <p>Received:</p>
              <div className="mt-10">
                 <p className="font-bold underline uppercase">MAYNARD ERL JOHN TAN ALVAREZ</p>
                 <p>Municipal Youth Development Officer</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}