import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjusted path
import { Lock, User } from "lucide-react";
import mydoLogo from "../../assets/mydo logo.png"; // Adjusted path to shared assets

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
      if (user.role === "MYDO_ADMIN") navigate("/mydo/dashboard");
      else if (["SK_CHAIR", "SK_SEC"].includes(user.role))
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
        {/* ... (Rest of JSX remains the same, just ensure imports above are correct) ... */}
        {/* Shortened for brevity, use your original JSX content here */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* ... inputs ... */}
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