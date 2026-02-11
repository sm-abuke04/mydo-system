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
    // MAIN BACKDROP
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0D2440]/40 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 transition-colors">
      
      {/* Container */}
      <div className={`bg-white dark:bg-slate-900 w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out border border-transparent dark:border-slate-700 ${
        viewMode === 'list' ? 'max-w-md max-h-[85vh]' : 'max-w-6xl h-[90vh]'
      }`}>
        
        {/* --- HEADER --- */}
        <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            {viewMode === 'chart' && (
              <button 
                onClick={() => setViewMode('list')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none transition-colors">
                Brgy. {barangay.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                   barangay.category === 'Poblacion' ? 'bg-amber-400' : 
                   barangay.category === 'University' ? 'bg-purple-400' : 
                   barangay.category === 'Coastal' ? 'bg-blue-400' : 'bg-emerald-400'
                }`} />
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                  {barangay.category} District
                </p>
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-auto bg-gray-50/10 dark:bg-slate-900/50 p-8 relative transition-colors">
          
          {viewMode === 'list' ? (
            /* ================= LIST VIEW ================= */
            <div className="space-y-6 animate-in slide-in-from-left-8 duration-300">
              <div className="flex flex-col items-center pt-4">
                <div className="w-20 h-20 bg-[#0D2440] dark:bg-blue-600 rounded-full flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-800 shadow-lg mb-3 transition-all">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white transition-colors">{officials.chairperson.name}</h3>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-widest mt-1 transition-colors">
                  SK Chairperson
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-3 transition-colors">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"><Mail size={16} /></div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase transition-colors">Secretary</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-slate-200 transition-colors">{officials.secretary.name}</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-3 transition-colors">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"><Briefcase size={16} /></div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase transition-colors">Treasurer</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-slate-200 transition-colors">{officials.treasurer.name}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="bg-gray-50/50 dark:bg-slate-800/80 px-4 py-2 border-b border-gray-100 dark:border-slate-700 transition-colors">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Council Members</h4>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-slate-700/50 transition-colors">
                  {officials.kagawads.map((kaga, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400 transition-colors`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-300 transition-colors">{kaga.name}</span>
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
                <div className="w-16 h-16 bg-[#0D2440] dark:bg-blue-600 text-white rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-xl mb-2 transition-all">
                  <ShieldCheck size={28} />
                </div>
                <div className="bg-white dark:bg-slate-800 px-6 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 text-center min-w-[200px] transition-colors">
                  <p className="text-sm font-black text-gray-900 dark:text-white transition-colors">{officials.chairperson.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest transition-colors">SK Chairperson</p>
                </div>
                <div className="h-8 w-0.5 bg-gray-200 dark:bg-slate-700 transition-colors"></div>
              </div>

              {/* LEVEL 2: Secretary & Treasurer */}
              <div className="relative flex justify-center gap-32 w-full mb-12">
                <div className="absolute top-0 w-80 h-4 border-t-2 border-gray-200 dark:border-slate-700 transition-colors"></div>
                
                {/* Secretary */}
                <div className="flex flex-col items-center -mt-2">
                  <div className="h-4 w-0.5 bg-gray-200 dark:bg-slate-700 transition-colors"></div>
                  <div className="bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-center w-48 transition-colors">
                    <div className="w-8 h-8 mx-auto bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-400 mb-1 transition-colors"><User size={14}/></div>
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200 transition-colors">{officials.secretary.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase transition-colors">Secretary</p>
                  </div>
                </div>

                {/* Treasurer */}
                <div className="flex flex-col items-center -mt-2">
                  <div className="h-4 w-0.5 bg-gray-200 dark:bg-slate-700 transition-colors"></div>
                  <div className="bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-center w-48 transition-colors">
                    <div className="w-8 h-8 mx-auto bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-400 mb-1 transition-colors"><User size={14}/></div>
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200 transition-colors">{officials.treasurer.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase transition-colors">Treasurer</p>
                  </div>
                </div>
              </div>

              {/* LEVEL 3: KAGAWADS CONTAINER (SPLIT LAYOUT) */}
              <div className="relative w-full max-w-5xl bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-200 dark:border-slate-700 p-12 shadow-sm transition-colors">
                
                {/* Header Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-sm transition-colors">
                  Sangguniang Kabataan Members
                </div>
                {/* Connector */}
                <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-gray-200 dark:bg-slate-700 -z-10 transition-colors"></div>

                <div className="flex gap-12 items-center w-full">
                  
                  {/* --- LEFT: Kagawad #1 (Prominent) --- */}
                  <div className="w-1/3 flex justify-center border-r border-gray-100 dark:border-slate-700 pr-12 transition-colors">
                    <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500 hover:shadow-lg transition-all w-full text-center group">
                      
                      {/* Badge #1 */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#0D2440] dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black border-4 border-white dark:border-slate-800 shadow-sm z-10 transition-all">
                        1
                      </div>

                      <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 mb-4 group-hover:bg-gray-100 dark:group-hover:bg-slate-600 transition-colors">
                        <User size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1 transition-colors">{leadKagawad.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider transition-colors">Kagawad</p>
                    </div>
                  </div>

                  {/* --- RIGHT: Kagawads #2-7 (3x2 Grid) --- */}
                  <div className="w-2/3 grid grid-cols-3 gap-4">
                    {remainingKagawads.map((kaga, i) => (
                      <div key={i} className="relative flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-md transition-all group">
                        
                        {/* Badge #2-7 */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-800 shadow-sm z-10 transition-colors">
                          {i + 2}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 mb-2 group-hover:bg-gray-100 dark:group-hover:bg-slate-600 transition-colors">
                          <User size={16} />
                        </div>
                        <p className="text-xs font-bold text-gray-800 dark:text-slate-200 text-center leading-tight transition-colors">{kaga.name}</p>
                        <p className="text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase mt-1 transition-colors">Kagawad</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex justify-center transition-colors">
            {viewMode === 'list' ? (
             <button 
                onClick={() => setViewMode('chart')}
                className="bg-[#0D2440] dark:bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1a3b5e] dark:hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10 dark:shadow-none active:scale-95"
              >
                View Organization Chart
              </button>
            ) : (
              <p className="text-[10px] font-bold text-gray-300 dark:text-slate-600 uppercase tracking-[0.2em] transition-colors">
                Organizational Structure • Brgy. {barangay.name}
              </p>
            )}
        </div>

      </div>
    </div>
  );
};

export default BarangayOfficialsModal;