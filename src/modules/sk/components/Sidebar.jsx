import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, UserPlus, FileText, Printer, Shield } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, profileCount }) {
  // Check if we are on mobile (simplistic check)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Dynamic Link Class
  const getLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-[#E7F0FA] text-[#2E5E99] font-bold shadow-sm border border-[#7BA4D0]/20 dark:bg-[#2E5E99] dark:text-white dark:border-transparent"
        : "text-[#0D2440]/70 hover:bg-[#E7F0FA] hover:text-[#0D2440] dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
    }`;

  return (
    <div
      className={`
      ${sidebarOpen ? "w-64" : "w-20"} 
      bg-white dark:bg-[#111827] 
      text-[#0D2440] dark:text-gray-100 
      border-r border-[#E7F0FA] dark:border-gray-800
      transition-all duration-300 flex flex-col shadow-sm print:hidden
    `}
    >
      <nav className="flex-1 p-4 space-y-2 pt-6">
        <NavLink to="/sk/dashboard" onClick={handleLinkClick} className={getLinkClass}>
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            Dashboard
          </span>
        </NavLink>

        <NavLink to="/sk/officials" onClick={handleLinkClick} className={getLinkClass}>
          <Shield className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            SK Officials
          </span>
        </NavLink>

        <NavLink to="/sk/add" onClick={handleLinkClick} className={getLinkClass}>
          <UserPlus className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            New Profile
          </span>
        </NavLink>

        <NavLink to="/sk/list" onClick={handleLinkClick} className={getLinkClass}>
          <FileText className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap flex-1 text-left ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            View Profiles
          </span>
          {/* Badge shows next to text when open, or as a dot/number overlay when closed if needed */}
          {sidebarOpen && profileCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E5E99] text-white font-medium dark:bg-blue-500">
              {profileCount}
            </span>
          )}
        </NavLink>

        <div className="pt-4 mt-4 border-t border-[#E7F0FA] dark:border-gray-800">
          <NavLink to="/sk/report" onClick={handleLinkClick} className={getLinkClass}>
            <Printer className="w-5 h-5 shrink-0" />
            <span
              className={`transition-opacity duration-200 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
            >
              Summary Report
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#E7F0FA] dark:border-gray-800">
        <div
          className={`text-xs text-[#7BA4D0] dark:text-gray-500 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}
        >
          <div>Sangguniang Kabataan</div>
          <div className="font-semibold text-[#2E5E99] dark:text-[#7BA4D0]">
            Digital Registry v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
