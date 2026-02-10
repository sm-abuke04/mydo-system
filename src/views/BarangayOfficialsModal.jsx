import React, { useState } from 'react';
import { X, User, ShieldCheck, Mail, Briefcase, ChevronLeft } from 'lucide-react';

const BarangayOfficialsModal = ({ isOpen, onClose, barangay }) => {
  const [viewMode, setViewMode] = useState('list');

  if (!isOpen || !barangay) return null;

  const officials = {
    chairperson: { name: `Hon. Juan Dela Cruz`, position: "SK Chairperson" },
    kagawads: [
      { name: "Hon. Maria Clara", position: "SK Kagawad" }, // #1
      { name: "Hon. Jose Rizal", position: "SK Kagawad" },
      { name: "Hon. Andres Bonifacio", position: "SK Kagawad" },
      { name: "Hon. Apolinario Mabini", position: "SK Kagawad" },
      { name: "Hon. Emilio Aguinaldo", position: "SK Kagawad" },
      { name: "Hon. Gabriela Silang", position: "SK Kagawad" },
      { name: "Hon. Melchora Aquino", position: "SK Kagawad" },
    ],
    secretary: { name: "Sec. Antonio Luna", position: "SK Secretary" },
    treasurer: { name: "Treas. Juan Luna", position: "SK Treasurer" },
  };

  const handleClose = () => {
    setViewMode('list');
    onClose();
  };

  // Split Data: 1 Lead + 6 Remaining
  const leadKagawad = officials.kagawads[0];
  const remainingKagawads = officials.kagawads.slice(1);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0D2440]/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Container */}
      <div className={`bg-white w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out ${
        viewMode === 'list' ? 'max-w-md max-h-[85vh]' : 'max-w-6xl h-[90vh]'
      }`}>
        
        {/* --- HEADER --- */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            {viewMode === 'chart' && (
              <button 
                onClick={() => setViewMode('list')}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-none">
                Brgy. {barangay.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                   barangay.category === 'Poblacion' ? 'bg-amber-400' : 
                   barangay.category === 'University' ? 'bg-purple-400' : 
                   barangay.category === 'Coastal' ? 'bg-blue-400' : 'bg-emerald-400'
                }`} />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {barangay.category} District
                </p>
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-auto bg-gray-50/10 p-8 relative">
          
          {viewMode === 'list' ? (
            /* ================= LIST VIEW ================= */
            <div className="space-y-6 animate-in slide-in-from-left-8 duration-300">
              <div className="flex flex-col items-center pt-4">
                <div className="w-20 h-20 bg-[#0D2440] rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-lg mb-3">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-lg font-black text-gray-900">{officials.chairperson.name}</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mt-1">
                  SK Chairperson
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Mail size={16} /></div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Secretary</p>
                    <p className="text-xs font-bold text-gray-900">{officials.secretary.name}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Briefcase size={16} /></div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Treasurer</p>
                    <p className="text-xs font-bold text-gray-900">{officials.treasurer.name}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Council Members</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  {officials.kagawads.map((kaga, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-100 text-gray-400`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{kaga.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* ================= CHART VIEW (1 LEFT / 6 RIGHT) ================= */
            <div className="flex flex-col items-center min-h-full py-4 animate-in zoom-in-95 duration-500">
              
              {/* LEVEL 1: Chairperson */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-16 h-16 bg-[#0D2440] text-white rounded-full flex items-center justify-center ring-4 ring-white shadow-xl mb-2">
                  <ShieldCheck size={28} />
                </div>
                <div className="bg-white px-6 py-2 rounded-xl shadow-sm border border-gray-200 text-center min-w-[200px]">
                  <p className="text-sm font-black text-gray-900">{officials.chairperson.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">SK Chairperson</p>
                </div>
                <div className="h-8 w-0.5 bg-gray-200"></div>
              </div>

              {/* LEVEL 2: Secretary & Treasurer */}
              <div className="relative flex justify-center gap-32 w-full mb-12">
                <div className="absolute top-0 w-80 h-4 border-t-2 border-gray-200"></div>
                
                {/* Secretary */}
                <div className="flex flex-col items-center -mt-2">
                  <div className="h-4 w-0.5 bg-gray-200"></div>
                  <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm text-center w-48">
                    <div className="w-8 h-8 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-1"><User size={14}/></div>
                    <p className="text-xs font-bold text-gray-800">{officials.secretary.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase">Secretary</p>
                  </div>
                </div>

                {/* Treasurer */}
                <div className="flex flex-col items-center -mt-2">
                  <div className="h-4 w-0.5 bg-gray-200"></div>
                  <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm text-center w-48">
                    <div className="w-8 h-8 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-1"><User size={14}/></div>
                    <p className="text-xs font-bold text-gray-800">{officials.treasurer.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase">Treasurer</p>
                  </div>
                </div>
              </div>

              {/* LEVEL 3: KAGAWADS CONTAINER (SPLIT LAYOUT) */}
              <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] border border-gray-200 p-12 shadow-sm">
                
                {/* Header Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-600 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-sm">
                  Sangguniang Kabataan Members
                </div>
                {/* Connector */}
                <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-gray-200 -z-10"></div>

                <div className="flex gap-12 items-center w-full">
                  
                  {/* --- LEFT: Kagawad #1 (Prominent) --- */}
                  <div className="w-1/3 flex justify-center border-r border-gray-100 pr-12">
                    <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all w-full text-center group">
                      
                      {/* Badge #1 */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#0D2440] text-white rounded-full flex items-center justify-center text-xs font-black border-4 border-white shadow-sm z-10">
                        1
                      </div>

                      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-gray-100 transition-colors">
                        <User size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-900 leading-tight mb-1">{leadKagawad.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Kagawad</p>
                    </div>
                  </div>

                  {/* --- RIGHT: Kagawads #2-7 (3x2 Grid) --- */}
                  <div className="w-2/3 grid grid-cols-3 gap-4">
                    {remainingKagawads.map((kaga, i) => (
                      <div key={i} className="relative flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group">
                        
                        {/* Badge #2-7 */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm z-10">
                          {i + 2}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-2 group-hover:bg-gray-100 transition-colors">
                          <User size={16} />
                        </div>
                        <p className="text-xs font-bold text-gray-800 text-center leading-tight">{kaga.name}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Kagawad</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex justify-center">
            {viewMode === 'list' ? (
             <button 
                onClick={() => setViewMode('chart')}
                className="bg-[#0D2440] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1a3b5e] transition-colors shadow-lg shadow-blue-900/10 active:scale-95"
              >
                View Organization Chart
              </button>
            ) : (
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                Organizational Structure • Brgy. {barangay.name}
              </p>
            )}
        </div>

      </div>
    </div>
  );
};

export default BarangayOfficialsModal;