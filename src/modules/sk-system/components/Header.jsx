import React, { useState } from "react";
import {
  Menu as MenuIcon,
  Users,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Check,
  Trash2,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SKLogo from "../assets/sk-logo.png";

export default function Header({
  view,
  profileCount,
  sidebarOpen,
  setSidebarOpen,
  isDarkMode,
  toggleTheme,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Backup Completed",
      message: "Weekly database backup was successful.",
      time: "2m ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "New Profile Added",
      message: "Juan Dela Cruz was added to the registry.",
      time: "1h ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "Pending Report Submission",
      message: "Quarterly SK Report is due tomorrow.",
      time: "5h ago",
      type: "warning",
      read: true,
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- NOTIFICATION HANDLERS ---
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-[#2E5E99] dark:text-blue-400" />;
    }
  };

  // Header Content Logic
  const getHeaderContent = () => {
    switch (view) {
      case "dashboard":
        return { title: "Dashboard", subtitle: "Analytics & Statistics" };
      case "officials":
        return { title: "SK Officials", subtitle: "Barangay Directory" };
      case "form":
        return { title: "New Profile", subtitle: "Add Youth Member" };
      case "list":
        return { title: "Database", subtitle: `${profileCount} Profiles` };
      case "profile":
        return { title: "My Profile", subtitle: "Account Management" };
      case "settings":
        return { title: "Settings", subtitle: "System Configuration" };
      default:
        return { title: "SK System", subtitle: "Youth Profiling" };
    }
  };
  const { title, subtitle } = getHeaderContent();

  const handleNavigation = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] shadow-md border-b border-[#E7F0FA] dark:border-gray-700 px-6 py-3 z-20 flex-shrink-0 relative print:hidden transition-colors duration-300">
      {/* Overlay */}
      {(isProfileOpen || isNotifOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotifOpen(false);
          }}
        />
      )}

      <div className="flex items-center justify-between h-16">
        {/* LEFT */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#E7F0FA] dark:hover:bg-gray-700 rounded-lg transition-colors text-[#2E5E99] dark:text-gray-200"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 border-r border-[#E7F0FA] dark:border-gray-700 pr-6 mr-2">
            <div className="bg-[#E7F0FA] dark:bg-gray-700 p-2 rounded-lg">
              <Users className="w-6 h-6 text-[#2E5E99] dark:text-blue-400" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg text-[#0D2440] dark:text-white leading-tight">
                SK System
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#7BA4D0] dark:text-gray-400">
                Youth Profiling
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-[#0D2440] dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-[#2E5E99] dark:text-[#7BA4D0] font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* CENTER LOGO */}
        <div
          onClick={() => navigate("/dashboard")}
          className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center group cursor-pointer z-30"
        >
          <div className="w-16 h-16 bg-transparent border-2 border-[#E7F0FA] dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm group-hover:border-[#2E5E99] dark:group-hover:border-blue-500 transition-all overflow-hidden">
            <img
              src={SKLogo}
              alt="SK Seal"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[9px] font-bold text-[#7BA4D0] dark:text-gray-500 mt-1 tracking-widest group-hover:text-[#2E5E99] dark:group-hover:text-blue-400 transition-colors">
            OFFICIAL SEAL
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 z-20">
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#7BA4D0] hover:text-[#2E5E99] hover:bg-[#E7F0FA] dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-gray-700 transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <div className="h-8 w-px bg-[#E7F0FA] dark:bg-gray-700"></div>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className={`relative p-2 rounded-full transition-all ${
                isNotifOpen
                  ? "bg-[#E7F0FA] dark:bg-gray-700 text-[#2E5E99] dark:text-white"
                  : "text-[#7BA4D0] hover:text-[#2E5E99] dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#1e293b] animate-pulse"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-[#E7F0FA] dark:border-gray-700 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-[#E7F0FA] dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm font-bold text-[#0D2440] dark:text-white">
                    Notifications ({unreadCount})
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={markAllRead}
                      title="Mark all read"
                      className="p-1 hover:bg-[#E7F0FA] dark:hover:bg-gray-700 rounded text-[#2E5E99] dark:text-blue-400 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={clearNotifications}
                      title="Clear all"
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#7BA4D0] dark:text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-[#E7F0FA]/50 dark:hover:bg-gray-700/50 transition-colors border-b border-[#E7F0FA]/50 dark:border-gray-700 last:border-0 relative group ${
                          !n.read ? "bg-[#E7F0FA]/20 dark:bg-gray-800" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 flex-shrink-0">
                            {getIcon(n.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p
                                className={`text-sm ${
                                  !n.read
                                    ? "font-bold text-[#0D2440] dark:text-white"
                                    : "font-medium text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {n.title}
                              </p>
                              <button
                                onClick={(e) => deleteNotification(e, n.id)}
                                className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-[#7BA4D0] dark:text-gray-500 mt-1 font-medium">
                              {n.time}
                            </p>
                          </div>
                        </div>
                        {!n.read && (
                          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-1.5 h-1.5 bg-[#2E5E99] dark:bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                <button className="w-full py-2 text-xs font-bold text-[#2E5E99] dark:text-blue-400 bg-[#E7F0FA]/30 dark:bg-gray-800 hover:bg-[#E7F0FA] dark:hover:bg-gray-700 border-t border-[#E7F0FA] dark:border-gray-700 transition-colors">
                  View All Activity
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-3 hover:bg-[#E7F0FA] dark:hover:bg-gray-700 p-1.5 rounded-xl transition-all"
            >
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-[#0D2440] dark:text-white">
                  Admin User
                </div>
                <div className="text-xs text-[#7BA4D0] dark:text-gray-400">
                  SK Secretary
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E5E99] to-[#0D2440] dark:from-blue-600 dark:to-blue-900 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                SK
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#7BA4D0] transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-[#E7F0FA] dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-[#E7F0FA] dark:border-gray-700 mb-2">
                  <p className="text-sm font-bold text-[#0D2440] dark:text-white">
                    Signed in as
                  </p>
                  <p className="text-xs text-[#7BA4D0] dark:text-gray-400 truncate">
                    sk.secretary@gov.ph
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="w-full text-left px-4 py-2 text-sm text-[#0D2440] dark:text-gray-200 hover:bg-[#E7F0FA] dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="w-full text-left px-4 py-2 text-sm text-[#0D2440] dark:text-gray-200 hover:bg-[#E7F0FA] dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> System Settings
                </button>
                <div className="my-2 border-t border-[#E7F0FA] dark:border-gray-700"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}