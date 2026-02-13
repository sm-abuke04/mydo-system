import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, User, GraduationCap, Briefcase, TrendingUp, Calendar, FileText,
  ArrowLeft, Upload, Activity, Database, Clock, CheckCircle2, AlertCircle,
  FileBox, Eye, Loader2
} from "lucide-react";
import { SKReportService } from "../services/SKReportService"; // Import new service

export default function Dashboard({ profiles, setView }) {
  const [showReports, setShowReports] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // FETCH REPORTS WHEN TOGGLED
  useEffect(() => {
    if (showReports) {
      const loadReports = async () => {
        setIsLoadingReports(true);
        try {
          const data = await SKReportService.getReports();
          setReports(data || []);
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
      value: profiles.filter((p) => (p.youthClassification || "").includes("In School")).length,
      icon: GraduationCap,
      iconColor: "text-[#0D2440] dark:text-gray-300",
      bg: "bg-[#E7F0FA] dark:bg-gray-700/50",
    },
    {
      label: "Out of School",
      value: profiles.filter((p) => (p.youthClassification || "").includes("Out of School")).length,
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
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Submitted
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-md">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0D2440] dark:text-white mb-2">
            {showReports ? "SK Reports Submission" : "Dashboard Overview"}
          </h2>
          <p className="text-[#7BA4D0] dark:text-gray-400 font-medium">
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
              : "bg-[#2E5E99] text-white hover:bg-[#0D2440] border-transparent"
          }`}
        >
          {showReports ? (
            <>
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" /> Reports Management
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
                className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-[#E7F0FA] dark:border-gray-700 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  {idx === 0 && <TrendingUp className="w-5 h-5 text-green-500" />}
                </div>
                <div className="text-3xl font-bold text-[#0D2440] dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[#7BA4D0] dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#E7F0FA] dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-[#E7F0FA] dark:border-gray-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2E5E99] dark:text-blue-400" />
              <h3 className="text-xl font-bold text-[#0D2440] dark:text-white">
                Recent Activity Logging
              </h3>
            </div>
            <div className="p-6">
              {profiles.length > 0 ? (
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#E7F0FA] dark:before:bg-gray-700">
                  {profiles
                    .slice(-4)
                    .reverse()
                    .map((profile) => (
                      <div
                        key={profile.id}
                        className="relative flex items-center justify-between md:justify-start md:gap-8 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] border-2 border-[#E7F0FA] dark:border-gray-600 text-[#2E5E99] dark:text-blue-400 shadow-sm shrink-0 z-10 group-hover:border-[#2E5E99] transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2 pl-2">
                          <div>
                            <p className="text-sm font-medium text-[#0D2440] dark:text-gray-200">
                              New profile added:{" "}
                              <Link
                                to={`/sk/edit/${profile.id}`}
                                className="text-[#2E5E99] dark:text-blue-400 font-bold hover:underline ml-1"
                              >
                                {profile.first_name || profile.firstName} {profile.last_name || profile.lastName}
                              </Link>
                            </p>
                            <p className="text-xs text-[#7BA4D0] dark:text-gray-500 font-semibold">
                              Barangay {profile.barangay}
                            </p>
                          </div>
                          <div className="text-xs font-mono text-[#7BA4D0] dark:text-gray-400 bg-[#E7F0FA] dark:bg-gray-800 px-2 py-1 rounded">
                            {new Date(profile.created_at || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Database className="w-12 h-12 text-[#E7F0FA] dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-[#7BA4D0] dark:text-gray-500">
                    No activity recorded yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* --- SK REPORTS CONTENT (Dynamic) --- */
        <div className="animate-in slide-in-from-bottom-2 duration-300 grid gap-8">
          {isLoadingReports ? (
             <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
             groupReports().map((group, gIdx) => (
               <div key={gIdx} className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-[#E7F0FA] dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 bg-[#E7F0FA]/50 dark:bg-gray-800/50 border-b border-[#E7F0FA] dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2E5E99] text-white rounded-lg">
                      <FileBox className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0D2440] dark:text-white">{group.title}</h3>
                      <p className="text-xs text-[#7BA4D0] dark:text-gray-400 uppercase tracking-wider font-bold">{group.frequency}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 grid gap-3 md:grid-cols-2">
                  {group.items.length > 0 ? group.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between p-4 border border-[#E7F0FA] dark:border-gray-700 rounded-xl hover:bg-[#E7F0FA] dark:hover:bg-gray-700/50 transition-all group">
                      <div>
                        <h4 className="font-bold text-[#0D2440] dark:text-gray-200 text-sm mb-1">{item.name}</h4>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(item.status)}
                          {item.submitted_at && (
                            <span className="text-xs text-[#7BA4D0] dark:text-gray-500">
                              Sub: {new Date(item.submitted_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-white bg-[#2E5E99] rounded-lg hover:bg-[#0D2440] hover:shadow-md transition-all" title="Upload Document">
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center text-gray-400 text-sm py-4 italic">No pending requirements for this category.</div>
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