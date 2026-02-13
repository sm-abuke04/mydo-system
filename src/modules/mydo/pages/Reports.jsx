import React, { useState, useEffect } from 'react';
import { 
  FileText, BarChart3, Download, Filter, 
  CheckCircle2, AlertCircle, Clock, Search, 
  ChevronDown, ArrowUpRight, Printer, X,
  PieChart, TrendingUp, Trash2, User, Loader2
} from 'lucide-react';
import { MydoService } from '../services/MYDOService';

const Reports = () => {
  // --- STATE ---
  const [selectedTab, setSelectedTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 5;

  // Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // --- DATA FETCHING ---
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, count } = await MydoService.getReports(statusFilter, searchQuery, currentPage, itemsPerPage);
      setSubmissions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    fetchReports();
  }, [statusFilter, currentPage, searchQuery]); // Add debouncing for search in production

  // --- HANDLERS ---
  const handleOpenReview = (report) => {
    setSelectedReport(report);
    setIsReviewModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      if (!selectedReport) return;
      await MydoService.updateReportStatus(selectedReport.id, newStatus);
      
      // Update local state to reflect change immediately
      setSubmissions(prev => prev.map(item => 
        item.id === selectedReport.id ? { ...item, status: newStatus } : item
      ));
      setIsReviewModalOpen(false);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // --- RENDER HELPERS ---
  const getStatusBadge = (status) => {
    const styles = {
      'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
      'Revision Needed': 'bg-red-50 text-red-600 border-red-100'
    };
    const style = styles[status] || 'bg-gray-50 text-gray-500';
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${style}`}>
        {status === 'Approved' && <CheckCircle2 size={12} />}
        {status === 'Pending' && <Clock size={12} />}
        {status === 'Revision Needed' && <AlertCircle size={12} />}
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 h-full shadow-sm flex flex-col overflow-hidden relative transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#0D2440] dark:text-white transition-colors">Reports & Analytics</h1>
          <p className="text-sm text-[#7BA4D0] dark:text-slate-400 mt-1 transition-colors">Monitor compliance and review SK submissions.</p>
        </div>
        <div className="flex gap-3">
            {/* Export buttons... */}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center transition-colors">
         {/* Tabs... */}
         <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
         </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        )}

        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0 z-10">
            <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Barangay / Official</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
            {submissions.length > 0 ? (
                submissions.map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={18} /></div>
                            <div>
                                <p className="text-sm font-bold text-[#0D2440] dark:text-white">{item.type}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{item.barangay}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.submitted_by}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-right">
                        <button onClick={() => handleOpenReview(item)} className="text-xs font-bold text-blue-600 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                            Review <ArrowUpRight size={14} />
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">No submissions found.</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex justify-between items-center shrink-0">
         <p className="text-xs font-medium text-gray-400">
             Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
         </p>
         <div className="flex gap-2">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
                Previous
            </button>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
                Next
            </button>
         </div>
      </div>

      {/* REVIEW MODAL (Reused logic from your original code, hooked to updateReportStatus) */}
      {isReviewModalOpen && selectedReport && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0D2440]/20 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                <div className="p-6">
                    <h3 className="text-lg font-black text-[#0D2440] dark:text-white">Review Submission</h3>
                    <p className="text-sm text-gray-500 mb-4">{selectedReport.type}</p>
                    
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => handleUpdateStatus('Revision Needed')} className="flex-1 py-2.5 border border-gray-200 text-red-600 font-bold rounded-xl text-xs hover:bg-red-50">Request Revision</button>
                        <button onClick={() => handleUpdateStatus('Approved')} className="flex-1 py-2.5 bg-[#0D2440] text-white font-bold rounded-xl text-xs hover:bg-[#1a3b5e]">Approve</button>
                    </div>
                </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Reports;