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

export default function SKYouthProfilingSystem() {
  // Theme State: Defaults to true (Dark Mode) to match your screenshots
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const API_URL = "http://localhost:5000/api/profiles";

  // Toggle Function
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Helper: Determine current view for Header title
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "dashboard";
    if (path.includes("/add")) return "form";
    if (path.includes("/edit")) return "form";
    if (path.includes("/list")) return "list";
    if (path.includes("/profile")) return "profile";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  };

  // Helper: Age Group Logic
  const getAgeGroup = (age) => {
    if (age >= 15 && age <= 17) return "Child Youth (15-17 yrs old)";
    if (age >= 18 && age <= 24) return "Core Youth (18-24 yrs old)";
    if (age >= 25 && age <= 30) return "Young Adult (25-30 yrs old)";
    return "N/A";
  };

  // Fetch Logic
  const fetchProfiles = async (query = "") => {
    setIsLoading(true);
    try {
      const url = query
        ? `${API_URL}?search=${encodeURIComponent(query)}`
        : API_URL;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const processed = data.map((p) => ({
        ...p,
        youthAgeGroup: getAgeGroup(p.age),
      }));
      setProfiles(processed);
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Save Logic
  const handleSaveProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const method = profileData.id ? "PUT" : "POST";
      const url = profileData.id ? `${API_URL}/${profileData.id}` : API_URL;
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        alert(profileData.id ? "Profile Updated!" : "Profile Saved!");
        await fetchProfiles();
      } else {
        alert("Server Error.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Network Error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?"))
      return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) await fetchProfiles();
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // MASTER THEME WRAPPER
    <div className={isDarkMode ? "dark" : ""}>
      {/* GLOBAL BACKGROUND: 
         Light: #E7F0FA 
         Dark: #0f172a (Slate 900 - similar to your screenshot)
      */}
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

        <div className="flex flex-1 overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} profileCount={profiles.length} />

          <main className="flex-1 overflow-y-auto min-w-0 relative">
            <div className="max-w-7xl mx-auto px-6 py-8 h-full">
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
