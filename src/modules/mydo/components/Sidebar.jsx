import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Map, FileText } from "lucide-react";

export default function Sidebar({ isSidebarShrinked }) {
  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
      isActive
        ? "bg-[#0D2440] dark:bg-blue-600 text-white shadow-lg"
        : "text-[#7BA4D0] dark:text-gray-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-800"
    }`;

  return (
    <nav
      className={`pl-10 pr-4 py-2 space-y-2 transition-all duration-300 shrink-0 ${isSidebarShrinked ? "w-24" : "w-72"}`}
    >
      <NavLink to="/mydo/dashboard" className={navLinkClass}>
        <Home className="w-5 h-5 shrink-0" />
        {!isSidebarShrinked && (
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300">
            Dashboard
          </span>
        )}
      </NavLink>
      <NavLink to="/mydo/profiles" className={navLinkClass}>
        <Users className="w-5 h-5 shrink-0" />
        {!isSidebarShrinked && (
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300">
            Profiles
          </span>
        )}
      </NavLink>
      <NavLink to="/mydo/map" className={navLinkClass}>
        <Map className="w-5 h-5 shrink-0" />
        {!isSidebarShrinked && (
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300">
            Map
          </span>
        )}
      </NavLink>
      <NavLink to="/mydo/reports" className={navLinkClass}>
        <FileText className="w-5 h-5 shrink-0" />
        {!isSidebarShrinked && (
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300">
            Reports
          </span>
        )}
      </NavLink>
    </nav>
  );
}
