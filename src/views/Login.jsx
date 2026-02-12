import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, User } from "lucide-react";
import mydoLogo from "../assets/mydo logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(username, password);
      // Redirect based on Role
      if (user.role === "MYDO_ADMIN") navigate("/mydo");
      else if (user.role === "SK_CHAIR" || user.role === "SK_SEC")
        navigate("/sk/dashboard");
    } catch (err) {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#E7F0FA] dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-96 border border-[#d1e3f8] dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <img src={mydoLogo} alt="MYDO Logo" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#0D2440] dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-[#7BA4D0] mb-6 text-sm">
          Sign in to access the monitoring system
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-xs p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-[#2E5E99] outline-none text-[#0D2440] dark:text-white text-sm"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-[#2E5E99] outline-none text-[#0D2440] dark:text-white text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#2E5E99] hover:bg-[#0D2440] text-white font-bold rounded-xl transition-all shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
