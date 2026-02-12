import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Component Imports
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProfileForm from "./components/ProfileForm";
import ProfileList from "./components/ProfileList";
import PrintableReport from "./components/PrintableReport";
import MyProfile from "./components/MyProfile";
import SystemSettings from "./components/SystemSettings";
import SKOfficials from "./components/SKOfficials"; // NEW OFFICIALS COMPONENT

// SERVICE IMPORT (The new data layer)
import { ProfileService } from "./services/ProfileService";
import { SKOfficialService } from "./services/SKOfficialService";

export default function SKYouthProfilingSystem() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Close sidebar on mobile route change
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [location]);

  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "dashboard";
    if (path.includes("/officials")) return "officials";
    if (path.includes("/add")) return "form";
    if (path.includes("/edit")) return "form";
    if (path.includes("/list")) return "list";
    if (path.includes("/profile")) return "profile";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  };

  const getAgeGroup = (age) => {
    if (age >= 15 && age <= 17) return "Child Youth (15-17 yrs old)";
    if (age >= 18 && age <= 24) return "Core Youth (18-24 yrs old)";
    if (age >= 25 && age <= 30) return "Young Adult (25-30 yrs old)";
    return "N/A";
  };

  // --- REFACTORED DATA FETCHING ---
  const fetchProfiles = async (query = "") => {
    setIsLoading(true);
    try {
      // Calling Service instead of fetch directly
      const data = await ProfileService.getAll(query);

      const processed = data.map((p) => ({
        ...p,
        youthAgeGroup: getAgeGroup(p.age),
      }));
      setProfiles(processed);
    } catch (error) {
      // Error is logged in Service, we just handle UI state here
      // Optional: Add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // --- REFACTORED SAVE (Create/Update) ---
  const handleSaveProfile = async (profileData) => {
    setIsLoading(true);
    try {
      if (profileData.id) {
        // UPDATE
        await ProfileService.update(profileData.id, profileData);
        alert("Profile Updated!");
      } else {
        // CREATE
        await ProfileService.create(profileData);
        alert("Profile Saved!");
      }
      await fetchProfiles();
    } catch (error) {
      alert("Operation Failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- REFACTORED DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?"))
      return;
    setIsLoading(true);
    try {
      await ProfileService.delete(id);
      await fetchProfiles();
    } catch (error) {
      alert("Delete Failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex flex-col h-screen bg-[#E7F0FA] dark:bg-[#0f172a] text-[#0D2440] dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#2E5E99] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#0D2440] dark:text-white font-medium">
                Processing...
              </span>
            </div>
          </div>
        )}

        <Header
          view={getCurrentView()}
          profileCount={profiles.length}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            profileCount={profiles.length}
          />

          <main className="flex-1 overflow-y-auto min-w-0 relative w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 h-full">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/dashboard"
                  element={<Dashboard profiles={profiles} setView={() => {}} />}
                />
                <Route
                  path="/officials"
                  element={<SKOfficials />}
                />
                <Route
                  path="/list"
                  element={
                    <ProfileList
                      profiles={profiles}
                      onDelete={handleDelete}
                      onSearch={fetchProfiles}
                    />
                  }
                />
                <Route
                  path="/add"
                  element={
                    <ProfileForm
                      profiles={profiles}
                      onSubmit={handleSaveProfile}
                    />
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProfileForm
                      profiles={profiles}
                      onSubmit={handleSaveProfile}
                    />
                  }
                />
                <Route
                  path="/report"
                  element={<PrintableReport profiles={profiles} />}
                />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/settings" element={<SystemSettings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
