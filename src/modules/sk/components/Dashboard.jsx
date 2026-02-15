import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, User, GraduationCap, Briefcase, TrendingUp, Calendar, FileText,
  ArrowLeft, Upload, Activity, Database, Clock, CheckCircle2, AlertCircle,
  FileBox, Loader2, Eye
} from "lucide-react";
// import { SKReportService } from "../services/SKReportService"; // Placeholder

export default function Dashboard({ profiles, setView }) {
  const [showReports, setShowReports] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // MOCK DATA for Reports (since service is not yet fully integrated)
  const mockReports = [
    { id: 1, name: "Comprehensive Barangay Youth Development Plan (CBYDP)", category: "Annual Requirements", status: "Pending", submitted_at: null },
    { id: 2, name: "Annual Barangay Youth Investment Program (ABYIP)", category: "Annual Requirements", status: "Submitted", submitted_at: "2024-01-15" },
    { id: 3, name: "Quarterly Financial Report (Q1)", category: "Quarterly Requirements", status: "Pending", submitted_at: null },
    { id: 4, name: "Accomplishment Report (January)", category: "Monthly Requirements", status: "In Progress", submitted_at: null },
  ];

  // FETCH REPORTS WHEN TOGGLED
  useEffect(() => {
    if (showReports) {
      const loadReports = async () => {
        setIsLoadingReports(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          setReports(mockReports);
        } catch (error) {
          console.error("Failed to load reports");
        } finally {
          setIsLoadingReports(false);
        }
      };
      loadReports();
    }
  }, [showReports]);

  // --- CLIENT-SIDE STATS CALCULATION (From 'profiles' prop) ---
  const stats = [
    {
      label: "Total Youth",
      value: profiles.length,
      icon: Users,
      iconColor: "text-[#2E5E99] dark:text-blue-400",
      bg: "bg-[#E7F0FA] dark:bg-blue-900/30",
    },
    {
      label: "Male",
      value: profiles.filter((p) => p.sex === "Male").length,
      icon: User,
      iconColor: "text-[#7BA4D0] dark:text-blue-300",
      bg: "bg-[#E7F0FA] dark:bg-blue-900/20",
    },
    {
      label: "Female",
      value: profiles.filter((p) => p.sex === "Female").length,
      icon: User,
      iconColor: "text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      label: "In School",
      value: profiles.filter((p) => {
        const val = p.youthClassification || [];
        return Array.isArray(val) ? val.includes("In School Youth") : val === "In School Youth";
      }).length,
      icon: GraduationCap,
      iconColor: "text-[#0D2440] dark:text-gray-300",
      bg: "bg-[#E7F0FA] dark:bg-gray-700/50",
    },
    {
      label: "Out of School",
      value: profiles.filter((p) => {
        const val = p.youthClassification || [];
        return Array.isArray(val) ? val.includes("Out of School Youth") : val === "Out of School Youth";
      }).length,
      icon: GraduationCap,
      iconColor: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Employed",
      value: profiles.filter((p) => p.workStatus === "Employed").length,
      icon: Briefcase,
      iconColor: "text-[#2E5E99] dark:text-blue-400",
      bg: "bg-[#E7F0FA] dark:bg-blue-900/30",
    },
    {
      label: "Unemployed",
      value: profiles.filter((p) => p.workStatus === "Unemployed").length,
      icon: Briefcase,
      iconColor: "text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Last Updated",
      value: new Date().toLocaleDateString(),
      icon: Calendar,
      iconColor: "text-[#0D2440] dark:text-gray-300",
      bg: "bg-[#E7F0FA] dark:bg-gray-700/50",
    },
  ];

  // GROUP REPORTS BY CATEGORY (Helper function)
  const groupReports = () => {
    // Defines structure even if empty
    const groups = {
      "Annual Requirements": [],
      "Quarterly Requirements": [],
      "Monthly Requirements": []
    };

    reports.forEach(r => {
      if (groups[r.category]) {
        groups[r.category].push(r);
      }
    });

    return Object.entries(groups).map(([title, items]) => ({
      title,
      items,
      frequency: title.includes("Annual") ? "Once a year" : title.includes("Quarterly") ? "Every 3 months" : "Every month"
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-3 h-3" /> Submitted
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-md border border-orange-200 dark:border-orange-800">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-[#0D2440] dark:text-white flex items-center gap-2">
            {showReports ? <FileText className="text-[#2E5E99]" /> : <TrendingUp className="text-[#2E5E99]" />}
            {showReports ? "SK Reports Submission" : "Dashboard Overview"}
          </h2>
          <p className="text-sm text-[#7BA4D0] dark:text-gray-400 font-medium mt-1">
            {showReports
              ? "Manage and upload required DILG & NYC documents"
              : "Real-time monitoring of youth profiling data"}
          </p>
        </div>

        <button
          onClick={() => setShowReports(!showReports)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm border ${
            showReports
              ? "bg-white dark:bg-[#1e293b] border-[#7BA4D0] text-[#2E5E99] dark:text-white hover:bg-[#E7F0FA] dark:hover:bg-gray-700"
              : "bg-[#2E5E99] text-white hover:bg-[#0D2440] border-transparent shadow-lg shadow-blue-900/20 active:scale-95"
          }`}
        >
          {showReports ? (
            <>
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" /> Manage Reports
            </>
          )}
        </button>
      </div>

      {!showReports ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-[#E7F0FA] dark:border-gray-700 hover:shadow-md transition-all group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg} transition-colors group-hover:bg-opacity-80`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  {idx === 0 && <TrendingUp className="w-5 h-5 text-green-500 animate-pulse" />}
                </div>
                <div className="text-3xl font-bold text-[#0D2440] dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[#7BA4D0] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-[#E7F0FA] dark:border-gray-700 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50">
              <Activity className="w-5 h-5 text-[#2E5E99] dark:text-blue-400" />
              <h3 className="text-lg font-bold text-[#0D2440] dark:text-white">
                Recent Activity Logging
              </h3>
            </div>
            <div className="p-6">
              {profiles.length > 0 ? (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#E7F0FA] dark:before:bg-gray-700">
                  {profiles
                    .slice(-4)
                    .reverse()
                    .map((profile) => (
                      <div
                        key={profile.id}
                        className="relative flex items-center justify-between md:justify-start md:gap-6 group"
                      >
                        <div className="absolute left-0 ml-5 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1e293b] border-2 border-[#E7F0FA] dark:border-gray-600 text-[#2E5E99] dark:text-blue-400 shadow-sm z-10 group-hover:border-[#2E5E99] transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2 pl-8 p-3 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-[#E7F0FA] dark:hover:border-gray-700">
                          <div>
                            <p className="text-sm font-bold text-[#0D2440] dark:text-gray-200">
                              New profile added:{" "}
                              <Link
                                to={`/sk/edit/${profile.id}`}
                                className="text-[#2E5E99] dark:text-blue-400 hover:underline ml-1"
                              >
                                {profile.firstName} {profile.lastName}
                              </Link>
                            </p>
                            <p className="text-xs text-[#7BA4D0] dark:text-gray-500 font-semibold mt-0.5">
                              Barangay {profile.barangay}
                            </p>
                          </div>
                          <div className="text-[10px] font-mono font-bold text-[#7BA4D0] dark:text-gray-400 bg-[#E7F0FA] dark:bg-gray-800 px-2 py-1 rounded border border-[#E7F0FA] dark:border-gray-700">
                            {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                    <Database className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 font-medium">
                    No activity recorded yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* --- SK REPORTS CONTENT (Dynamic) --- */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid gap-6">
          {isLoadingReports ? (
             <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-[#1e293b] rounded-xl border border-[#E7F0FA] dark:border-gray-700">
                <Loader2 className="animate-spin text-[#2E5E99] w-10 h-10 mb-4" />
                <p className="text-[#7BA4D0] font-bold text-sm">Loading Requirements...</p>
             </div>
          ) : (
             groupReports().map((group, gIdx) => (
               <div key={gIdx} className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-b border-[#E7F0FA] dark:border-gray-700 flex justify-between items-center backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2E5E99] text-white rounded-lg shadow-sm">
                      <FileBox className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0D2440] dark:text-white text-lg">{group.title}</h3>
                      <p className="text-[10px] text-[#7BA4D0] dark:text-gray-400 uppercase tracking-widest font-bold">{group.frequency}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {group.items.length > 0 ? group.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between p-5 border border-[#E7F0FA] dark:border-gray-700 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700/30 transition-all group bg-white dark:bg-gray-800/20">
                      <div>
                        <h4 className="font-bold text-[#0D2440] dark:text-gray-200 text-sm mb-2 group-hover:text-[#2E5E99] transition-colors">{item.name}</h4>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(item.status)}
                          {item.submitted_at ? (
                            <span className="text-[10px] font-mono text-[#7BA4D0] dark:text-gray-500 border border-[#E7F0FA] dark:border-gray-700 px-2 py-0.5 rounded">
                              {new Date(item.submitted_at).toLocaleDateString()}
                            </span>
                          ) : (
                             <span className="text-[10px] font-mono text-red-300 dark:text-red-900/50 border border-transparent px-2 py-0.5 rounded italic">
                              Due Soon
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {item.status === 'Submitted' ? (
                            <button className="p-2.5 text-[#2E5E99] bg-[#E7F0FA] rounded-lg hover:bg-[#d1e3f8] dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40 transition-all" title="View Submission">
                                <Eye className="w-4 h-4" />
                            </button>
                         ) : (
                            <button className="flex items-center gap-2 px-4 py-2 text-white bg-[#2E5E99] rounded-lg hover:bg-[#0D2440] shadow-md shadow-blue-900/10 transition-all active:scale-95 text-xs font-bold" title="Upload Document">
                                <Upload className="w-4 h-4" /> Upload
                            </button>
                         )}
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center text-gray-400 text-sm py-8 italic bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                        No pending requirements for this category.
                    </div>
                  )}
                </div>
              </div>
             ))
          )}
        </div>
      )}
    </div>
  );
}