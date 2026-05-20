import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, Menu, X, Zap, LogOut, User, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import api from "../services/api";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.length >= 2) {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(val)}`);
        setSearchResults(res.data.projects || []);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px] gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#FFB612]" />
              </div>
              <span className="text-lg font-bold text-[#111827] hidden sm:block">
                VibePush<span className="text-[#009639]"> SA</span>
              </span>
            </Link>

            <div className="flex-1 max-w-xl hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] transition-colors"
                />
              </div>
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                  {searchResults.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery("");
                        navigate("/");
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: p.logo_color }}
                      >
                        {p.logo_initial}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#111827] truncate">{p.name}</div>
                        <div className="text-xs text-gray-500 truncate">{p.tagline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => setBrowseOpen(true)}
                onMouseLeave={() => setBrowseOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#111827] rounded-lg hover:bg-gray-50 transition-colors">
                  Browse <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {browseOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">All Projects</Link>
                    <Link to="/leaderboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Leaderboard</Link>
                  </div>
                )}
              </div>
              <Link to="/how-it-works" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#111827] rounded-lg hover:bg-gray-50 transition-colors">
                Rules
              </Link>
              <Link to="/leaderboard" className="px-3 py-2 text-sm font-medium text-[#009639] hover:text-[#007a2f] rounded-lg hover:bg-green-50 transition-colors">
                Leaderboard
              </Link>
              <Link to="/blog" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#111827] rounded-lg hover:bg-gray-50 transition-colors">
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-[#111827] max-w-[100px] truncate">{user.name}</span>
                  </Link>
                  {user.is_admin && (
                    <Link
                      to="/admin"
                      className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-xl hover:bg-amber-100 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModal({ open: true, mode: "login" })}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-[#111827] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthModal({ open: true, mode: "register" })}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#111827] rounded-xl hover:bg-[#1f2937] transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
              <button
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <div className="mb-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#009639]/20"
                />
              </div>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">All Projects</Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Rules</Link>
              <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[#009639] hover:bg-green-50 rounded-lg">Leaderboard</Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Blog</Link>
              <Link to="/submit" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Submit Project</Link>
              {user && (
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">My Profile</Link>
              )}
              {user?.is_admin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-lg">Admin Panel</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ open: false, mode: "login" })}
        initialMode={authModal.mode}
      />
    </>
  );
};

export default Navbar;
