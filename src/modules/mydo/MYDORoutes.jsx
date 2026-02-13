import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  Users,
  Map,
  FileText,
  Menu,
  LogOut,
  Search,
  Bell,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import Pages from local module folder
// Ensure you moved files to: src/modules/mydo/pages/
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import MapView from "./pages/Map";
import Reports from "./pages/Reports";

// Shared Assets/Components
import mydoLogo from "../../assets/mydo logo.png";

export default function MYDORoutes() {
  const { user, logout } = useAuth();
  const [isSidebarShrinked, setIsSidebarShrinked] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
      isActive
        ? "bg-[#0D2440] dark:bg-blue-600 text-white shadow-lg"
        : "text-[#7BA4D0] dark:text-gray-400 hover:bg-[#e7f0fa] dark:hover:bg-slate-800"
    }`;

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-6 shrink-0 bg-gray-50 dark:bg-slate-900 z-20">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsSidebarShrinked(!isSidebarShrinked)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800"
          >
            <Menu className="w-6 h-6 text-[#0D2440] dark:text-white" />
          </button>
          <span className="text-xl font-bold text-[#0D2440] dark:text-white">
            MYDO SYSTEM
          </span>
        </div>
        <img
          src={mydoLogo}
          alt="Logo"
          className="w-16 h-16 rounded-full shadow-lg"
        />
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-[#0D2440] dark:text-white">
              {user?.firstName}
            </p>
            <p className="text-xs text-[#7BA4D0]">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-full text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <nav
          className={`pl-10 pr-4 py-2 space-y-2 transition-all duration-300 shrink-0 ${isSidebarShrinked ? "w-24" : "w-72"}`}
        >
          <NavLink to="dashboard" className={navLinkClass}>
            <Home className="w-5 h-5" />{" "}
            {!isSidebarShrinked && (
              <span className="text-sm font-semibold">Dashboard</span>
            )}
          </NavLink>
          <NavLink to="profiles" className={navLinkClass}>
            <Users className="w-5 h-5" />{" "}
            {!isSidebarShrinked && (
              <span className="text-sm font-semibold">Profiles</span>
            )}
          </NavLink>
          <NavLink to="map" className={navLinkClass}>
            <Map className="w-5 h-5" />{" "}
            {!isSidebarShrinked && (
              <span className="text-sm font-semibold">Map</span>
            )}
          </NavLink>
          <NavLink to="reports" className={navLinkClass}>
            <FileText className="w-5 h-5" />{" "}
            {!isSidebarShrinked && (
              <span className="text-sm font-semibold">Reports</span>
            )}
          </NavLink>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 h-full pr-10 pb-10 pl-2 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profiles" element={<Profiles />} />
            <Route path="map" element={<MapView />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}