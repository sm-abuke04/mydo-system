import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import mydoLogo from "../../../assets/mydo logo.png";

export default function Header({
  isSidebarShrinked,
  setIsSidebarShrinked,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Modals / Dropdowns State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- MOCK NOTIFICATIONS ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Profile Review",
      message: "Brgy. Poblacion submitted 5 new youth profiles.",
      time: "10m ago",
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "System Update",
      message: "Version 1.2 is now live.",
      time: "2h ago",
      type: "success",
      read: true,
    },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

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

  // --- HANDLERS ---
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/mydo/profiles?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="flex items-center justify-between px-10 py-6 shrink-0 bg-gray-50 dark:bg-slate-900 z-20 relative">
      {/* Overlay to close dropdowns */}
      {(isNotifOpen || isSettingsOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsNotifOpen(false);
            setIsSettingsOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}

      {/* LEFT: Logo & Toggle */}
      <div className="flex items-center gap-6 z-20">
        <button
          onClick={() => setIsSidebarShrinked(!isSidebarShrinked)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-[#0D2440] dark:text-white" />
        </button>
        <span className="text-xl font-bold text-[#0D2440] dark:text-white hidden sm:block">
          MYDO SYSTEM
        </span>
      </div>

      {/* CENTER: Logo (Optional) or Search */}
      <div className="hidden md:flex items-center gap-4 flex-1 justify-center z-20 px-8">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search profiles, reports..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5E99] transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
      </div>

      {/* RIGHT: User Controls */}
      <div className="flex items-center gap-3 z-20">

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsSettingsOpen(false);
                setIsProfileOpen(false);
            }}
            className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-5 h-5 text-[#0D2440] dark:text-white" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notification Modal */}
          {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-30">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                  <span className="text-sm font-bold text-[#0D2440] dark:text-white">
                    Notifications ({unreadCount})
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={markAllRead}
                      title="Mark all read"
                      className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-[#2E5E99] dark:text-blue-400 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" />
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
                    <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0 relative group ${
                          !n.read ? "bg-blue-50/50 dark:bg-slate-700/30" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 shrink-0">
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
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="relative">
            <button
                onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setIsNotifOpen(false);
                    setIsProfileOpen(false);
                }}
                className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
            >
                <Settings className="w-5 h-5 text-[#0D2440] dark:text-white" />
            </button>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-30">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                        <p className="text-sm font-bold text-[#0D2440] dark:text-white">System Settings</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> System Status: Online
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                        Appearance
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                        Notification Preferences
                    </button>
                </div>
            )}
        </div>

        {/* PROFILE */}
        <div className="relative pl-2 border-l border-gray-200 dark:border-slate-700">
            <button
                onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                    setIsSettingsOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800 p-1 rounded-full pr-3 transition-all"
            >
                <img
                    src={mydoLogo}
                    alt="Logo"
                    className="w-8 h-8 rounded-full shadow-sm object-cover bg-white"
                />
                <div className="text-left hidden lg:block leading-tight">
                    <p className="text-xs font-bold text-[#0D2440] dark:text-white">
                    {user?.first_name || "Admin"}
                    </p>
                    <p className="text-[10px] text-[#7BA4D0]">Administrator</p>
                </div>
            </button>

            {/* Profile Modal */}
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-30">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 mb-1">
                        <p className="text-sm font-bold text-[#0D2440] dark:text-white">Signed in as</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4" /> My Profile
                    </button>

                    <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            )}
        </div>

      </div>
    </header>
  );
}
