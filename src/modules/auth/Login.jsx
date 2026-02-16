import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Lock, User, Shield } from "lucide-react";
import mydoLogo from "@/assets/mydo logo.png";
import RequestAccountModal from "./RequestAccountModal"; // Import the modal

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Trim inputs
      const { user, error: loginError } = await login(username.trim(), password.trim());
      
      if (loginError) throw loginError;

      // Ensure user exists before checking role
      if (!user) throw new Error("Authentication successful but user data missing.");

      // Normalize role for comparison
      const role = user.role?.toUpperCase() || "";

      // Role Based Redirect
      if (role === "MYDO_ADMIN") {
        navigate("/mydo/dashboard");
      } else if (["SK_CHAIR", "SK_SEC"].includes(role)) {
        // Pending Check is handled in AuthContext, but we can double check here
        if (user.status === 'Pending') {
          setError("Your account is pending approval from MYDO Admin.");
          return;
        }
        navigate("/sk/dashboard");
      } else {
        // Show role for debugging
        setError(`Unauthorized role: '${user.role}'. Please contact support.`);
      }

    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("Pending")) {
        setError("Your account is pending approval.");
      } else if (err.message && err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else {
        // Show actual error for debugging if possible, otherwise generic
        setError(err.message || "An error occurred during sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#E7F0FA] dark:bg-slate-900 transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-96 border border-[#d1e3f8] dark:border-slate-700 animate-in fade-in zoom-in duration-300">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <img src={mydoLogo} alt="MYDO Logo" className="w-20 h-20 mb-4 drop-shadow-md" />
          <h2 className="text-2xl font-black text-[#0D2440] dark:text-white">Welcome Back</h2>
          <p className="text-xs font-bold text-[#7BA4D0] uppercase tracking-widest">Profiling System Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl text-center border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-bold text-[#0D2440] dark:text-white outline-none focus:ring-2 focus:ring-[#2E5E99] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-bold text-[#0D2440] dark:text-white outline-none focus:ring-2 focus:ring-[#2E5E99] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2E5E99] hover:bg-[#0D2440] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex justify-center items-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
          <p className="text-xs text-gray-400 mb-3">Are you an SK Official?</p>
          <button 
            onClick={() => setIsRequestOpen(true)}
            className="text-xs font-bold text-[#2E5E99] hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Shield size={14}/> Request Account Access
          </button>
        </div>
      </div>

      <RequestAccountModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
    </div>
  );
}