import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <svg width="180" height="44" viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <path d="M 200,80 L 180,80 L 180,240 L 200,240" fill="none" stroke="#534AB7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 480,80 L 500,80 L 500,240 L 480,240" fill="none" stroke="#1D9E75" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="340" y="185" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="100" fontWeight="700" letterSpacing="-2" fill="#2C2C2A">ILab</text>
          </svg>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Admin Console</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to manage the platform</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="admin@innovationlab.co.za"
                className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-11 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 shadow-sm">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          Admin access is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
