import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X, LogOut, User, Shield, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import NotificationBell from "./NotificationBell";

const timeline = [
  { phase: "Registration", status: "completed" },
  { phase: "Building", status: "completed" },
  { phase: "Voting", status: "active" },
  { phase: "Semi-Finals", status: "upcoming" },
  { phase: "Finals", status: "upcoming" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center h-[60px] gap-4">
            <Link to="/" className="flex items-center shrink-0">
              <svg width="200" height="50" viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
                <path d="M 200,80 L 180,80 L 180,240 L 200,240" fill="none" stroke="#534AB7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M 480,80 L 500,80 L 500,240 L 480,240" fill="none" stroke="#1D9E75" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="340" y="185" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="100" fontWeight="700" letterSpacing="-2" fill="#2C2C2A">ILab</text>
                <text x="340" y="232" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="11" fontWeight="400" letterSpacing="5" fill="#888780">INNOVATION LAB</text>
              </svg>
            </Link>

            {/* Timeline indicator */}
            <div className="hidden xl:flex items-center gap-2 ml-4 text-[11px] font-semibold">
              <span className="text-[#009639]">Registration</span>
              <span className="w-1 h-1 bg-[#009639] rounded-full" />
              <span className="text-[#009639]/70 text-[10px] font-medium">Open Now</span>
            </div>

            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <div
                className="relative"
                onMouseEnter={() => setBrowseOpen(true)}
                onMouseLeave={() => setBrowseOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-800 rounded-lg hover:bg-gray-50 transition-colors">
                  Browse <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {browseOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">All Projects</Link>
                    <Link to="/leaderboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Leaderboard</Link>
                    <Link to="/hall-of-fame" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Hall of Fame</Link>
                  </div>
                )}
              </div>
              <Link to="/how-it-works" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-800 rounded-lg hover:bg-gray-50 transition-colors">
                Rules
              </Link>
              <Link to="/leaderboard" className="px-3 py-2 text-sm font-medium text-[#009639] hover:text-[#007a2f] rounded-lg hover:bg-green-50 transition-colors">
                Leaderboard
              </Link>
              <Link to="/blog" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-800 rounded-lg hover:bg-gray-50 transition-colors">
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-purple-800 max-w-[100px] truncate">{user.name}</span>
                  </Link>
                  {user.is_admin && (
                    <Link
                      to="/admin"
                      className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-xl hover:bg-amber-100 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </Link>
                  )}
                  <NotificationBell />
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
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-purple-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthModal({ open: true, mode: "register" })}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
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
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">All Projects</Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Rules</Link>
              <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[#009639] hover:bg-green-50 rounded-lg">Leaderboard</Link>
              <Link to="/hall-of-fame" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Hall of Fame</Link>
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
