import React, { useState, useMemo } from 'react';
import { 
  FileText, BarChart3, Download, Filter, 
  CheckCircle2, AlertCircle, Clock, Search, 
  ChevronDown, ArrowUpRight, Printer, X,
  PieChart, TrendingUp, MoreVertical, Eye, Trash2, User // Added User import for the modal
} from 'lucide-react';

const ReportsView = () => {
  // --- STATE MANAGEMENT ---
  const [selectedTab, setSelectedTab] = useState('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // --- MOCK DATA (In State to allow updates) ---
  const [submissions, setSubmissions] = useState([
    { id: 1, type: "CBYIP 2026", barangay: "Brgy. Old Rizal", submittedBy: "Hon. Maria Clara", date: "Feb 06, 2026", status: "Pending", size: "2.4 MB" },
    { id: 2, type: "Q1 Financial Report", barangay: "Brgy. Dalakit", submittedBy: "Hon. Jose Rizal", date: "Feb 05, 2026", status: "Approved", size: "1.1 MB" },
    { id: 3, type: "Annual Accomplishment", barangay: "Brgy. Baybay", submittedBy: "Hon. Andres Bonifacio", date: "Feb 04, 2026", status: "Revision Needed", size: "5.8 MB" },
    { id: 4, type: "Youth Profile Update", barangay: "Brgy. UEP Zone 1", submittedBy: "Hon. Apolinario Mabini", date: "Feb 03, 2026", status: "Approved", size: "850 KB" },
    { id: 5, type: "Project Proposal: Sports", barangay: "Brgy. Acacia", submittedBy: "Hon. Emilio Aguinaldo", date: "Feb 02, 2026", status: "Pending", size: "3.2 MB" },
    { id: 6, type: "ABYIP 2026", barangay: "Brgy. Yakal", submittedBy: "Hon. Gabriela Silang", date: "Feb 01, 2026", status: "Approved", size: "4.1 MB" },
    { id: 7, type: "SK Budget 2026", barangay: "Brgy. Narra", submittedBy: "Hon. Melchora Aquino", date: "Jan 30, 2026", status: "Pending", size: "1.9 MB" },
    { id: 8, type: "Event Liquidation", barangay: "Brgy. Molave", submittedBy: "Hon. Tandang Sora", date: "Jan 28, 2026", status: "Approved", size: "3.5 MB" },
  ]);

  // --- STATS OVERVIEW ---
  const stats = [
    { label: "Total Reports", value: submissions.length, change: "+12%", icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
    { label: "Approved", value: submissions.filter(s => s.status === 'Approved').length, change: "+5%", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "Pending", value: submissions.filter(s => s.status === 'Pending').length, change: "-8", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
    { label: "Revisions", value: submissions.filter(s => s.status === 'Revision Needed').length, change: "+2%", icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" },
  ];

  // --- LOGIC: Filtering & Pagination ---
  const filteredData = useMemo(() => {
    return submissions.filter(item => {
      const matchesSearch = 
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [submissions, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- HANDLERS ---
  const handleOpenReview = (report) => {
    setSelectedReport(report);
    setIsReviewModalOpen(true);
  };

  const handleUpdateStatus = (newStatus) => {
    setSubmissions(prev => prev.map(item => 
      item.id === selectedReport.id ? { ...item, status: newStatus } : item
    ));
    setIsReviewModalOpen(false);
  };

  return (
    // MAIN WRAPPER
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 h-full shadow-sm flex flex-col overflow-hidden relative transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#0D2440] dark:text-white transition-colors">Reports & Analytics</h1>
          <p className="text-sm text-[#7BA4D0] dark:text-slate-400 mt-1 transition-colors">Monitor compliance and review SK submissions.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#0D2440] dark:text-white text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <Printer size={16} />
            PRINT
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0D2440] dark:bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-[#1a3b5e] dark:hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10 dark:shadow-none">
            <Download size={16} />
            EXPORT
          </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
        {stats.map((stat, index) => (
          <div key={index} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-colors`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${stat.change.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#0D2440] dark:text-white transition-colors">{stat.value}</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mt-1 transition-colors">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center transition-colors">
          
          {/* Tabs */}
          <div className="flex bg-gray-100/50 dark:bg-slate-800 p-1 rounded-xl transition-colors">
            <button 
              onClick={() => setSelectedTab('submissions')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${selectedTab === 'submissions' ? 'bg-white dark:bg-slate-700 text-[#0D2440] dark:text-white shadow-sm' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}
            >
              <FileText size={14} /> Recent Submissions
            </button>
            <button 
              onClick={() => setSelectedTab('analytics')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${selectedTab === 'analytics' ? 'bg-white dark:bg-slate-700 text-[#0D2440] dark:text-white shadow-sm' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}
            >
              <BarChart3 size={14} /> Compliance Analytics
            </button>
          </div>

          {/* Filters (Only visible in Submissions tab) */}
          {selectedTab === 'submissions' && (
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0D2440] dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 w-48 transition-all"
                />
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Filter size={14} />
                  {statusFilter === 'All' ? 'Filter' : statusFilter}
                  <ChevronDown size={14} />
                </button>
                {/* Simple Dropdown for Filter */}
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden hidden group-hover:block z-20">
                  {['All', 'Approved', 'Pending', 'Revision Needed'].map(status => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-[#0D2440] dark:hover:text-white transition-colors"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- VIEW CONTENT --- */}
        <div className="flex-1 overflow-auto p-0">
          
          {selectedTab === 'submissions' ? (
            /* === SUBMISSIONS TABLE === */
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0 z-10 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-700">Report Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-700">Barangay / Official</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-700">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-700">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest border-b border-gray-200 dark:border-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900 transition-colors">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm transition-all">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0D2440] dark:text-white">{item.type}</p>
                            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500">{item.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{item.barangay}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{item.submittedBy}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                          <Clock size={14} />
                          <span className="text-xs font-medium">{item.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border transition-colors ${
                          item.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' :
                          item.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50' :
                          'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50'
                        }`}>
                          {item.status === 'Approved' && <CheckCircle2 size={12} />}
                          {item.status === 'Pending' && <Clock size={12} />}
                          {item.status === 'Revision Needed' && <AlertCircle size={12} />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleOpenReview(item)}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                            Review <ArrowUpRight size={14} />
                            </button>
                            <button className="text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 dark:text-slate-500 text-sm">
                      No submissions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* === ANALYTICS VIEW === */
            <div className="p-8 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. Report Distribution Chart (CSS only) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><PieChart size={20}/></div>
                        <h3 className="font-bold text-[#0D2440] dark:text-white">Submission Status Distribution</h3>
                    </div>
                    
                    <div className="flex items-end gap-8 h-48 px-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                        {/* Bar 1: Approved */}
                        <div className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-t-xl relative group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/80 transition-colors" style={{height: '65%'}}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-600 dark:text-emerald-400">65%</div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase">Approved</span>
                        </div>
                        {/* Bar 2: Pending */}
                        <div className="flex-1 flex flex-col items-center gap-2 group">
                             <div className="w-full bg-amber-100 dark:bg-amber-900/50 rounded-t-xl relative group-hover:bg-amber-200 dark:group-hover:bg-amber-800/80 transition-colors" style={{height: '25%'}}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-600 dark:text-amber-400">25%</div>
                             </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase">Pending</span>
                        </div>
                         {/* Bar 3: Revision */}
                         <div className="flex-1 flex flex-col items-center gap-2 group">
                             <div className="w-full bg-red-100 dark:bg-red-900/50 rounded-t-xl relative group-hover:bg-red-200 dark:group-hover:bg-red-800/80 transition-colors" style={{height: '10%'}}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 dark:text-red-400">10%</div>
                             </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase">Revision</span>
                        </div>
                    </div>
                </div>

                {/* 2. Top Performing Barangays */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><TrendingUp size={20}/></div>
                        <h3 className="font-bold text-[#0D2440] dark:text-white">Top Compliant Barangays</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            {name: 'Brgy. Old Rizal', score: 98, color: 'bg-emerald-500'},
                            {name: 'Brgy. Dalakit', score: 92, color: 'bg-blue-500'},
                            {name: 'Brgy. UEP Zone 1', score: 88, color: 'bg-purple-500'},
                            {name: 'Brgy. Yakal', score: 85, color: 'bg-amber-500'}
                        ].map((b, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 w-4">0{i+1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold text-[#0D2440] dark:text-slate-200">{b.name}</span>
                                        <span className="text-xs font-bold text-gray-500 dark:text-slate-400">{b.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${b.color} rounded-full`} style={{width: `${b.score}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}
        </div>
        
        {/* Pagination Footer (Only for Submissions) */}
        {selectedTab === 'submissions' && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0 transition-colors">
            <p className="text-xs font-medium text-gray-400 dark:text-slate-500">
                Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} submissions
            </p>
            <div className="flex gap-2">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
            </div>
        )}
      </div>

      {/* --- REVIEW MODAL --- */}
      {isReviewModalOpen && selectedReport && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0D2440]/20 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                {/* Modal Header */}
                <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center transition-colors">
                    <div>
                        <h3 className="text-lg font-black text-[#0D2440] dark:text-white">Review Submission</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">ID: #{selectedReport.id} • {selectedReport.date}</p>
                    </div>
                    <button onClick={() => setIsReviewModalOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={18} className="text-gray-500 dark:text-slate-400"/></button>
                </div>
                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors"><FileText size={24} /></div>
                        <div>
                            <p className="text-sm font-bold text-[#0D2440] dark:text-white">{selectedReport.type}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{selectedReport.barangay}</p>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors">
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Submitted By</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                             <User size={14} className="text-gray-400 dark:text-slate-500"/> {selectedReport.submittedBy}
                        </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors">
                         <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Status</p>
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border bg-white dark:bg-slate-900 transition-colors ${
                          selectedReport.status === 'Approved' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' :
                          selectedReport.status === 'Pending' ? 'text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50' :
                          'text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50'
                        }`}>
                             {selectedReport.status}
                         </span>
                    </div>
                </div>
                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3 transition-colors">
                    <button 
                        onClick={() => handleUpdateStatus('Revision Needed')}
                        className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl hover:bg-red-50 dark:hover:bg-slate-700 hover:border-red-100 dark:hover:border-slate-500 transition-colors"
                    >
                        Request Revision
                    </button>
                    <button 
                        onClick={() => handleUpdateStatus('Approved')}
                        className="flex-1 py-2.5 bg-[#0D2440] dark:bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-[#1a3b5e] dark:hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10 dark:shadow-none"
                    >
                        Approve Report
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ReportsView;