import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { X, LogIn, UserPlus } from "lucide-react";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "", institution: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode with initialMode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setForm({ name: "", email: "", password: "", institution: "" });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.institution);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#111827]">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name" value={form.name} onChange={handleChange} required
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Institution</label>
                <input
                  name="institution" value={form.institution} onChange={handleChange}
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
                  placeholder="e.g., University of Cape Town"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange} required
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
              placeholder="Min 6 characters"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full h-10 text-sm font-semibold text-white bg-[#111827] rounded-lg hover:bg-[#1f2937] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? (
              <><LogIn className="w-4 h-4" /> Sign in</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Create account</>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === "login" ? (
            <p className="text-xs text-gray-500">
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} className="text-[#009639] font-medium hover:underline">
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-[#009639] font-medium hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
