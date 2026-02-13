import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import MapView from "./pages/Map";
import Reports from "./pages/Reports";

export default function MYDORoutes() {
  const [isSidebarShrinked, setIsSidebarShrinked] = useState(false);

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* HEADER */}
      <Header
        isSidebarShrinked={isSidebarShrinked}
        setIsSidebarShrinked={setIsSidebarShrinked}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar isSidebarShrinked={isSidebarShrinked} />

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
