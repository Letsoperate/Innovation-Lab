import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Upload, ArrowRight, Trophy, ClipboardList } from "lucide-react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="text-center pb-6 mb-2 animate-fade-in-up">
      {/* Top mini nav */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <Link
          to="/leaderboard"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Trophy className="w-3 h-3" /> Leaderboard
        </Link>
        <Link
          to="/how-it-works"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ClipboardList className="w-3 h-3" /> Rules
        </Link>
        <Link
          to="/blog"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-3 h-3" /> Blog
        </Link>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-3 leading-tight">
        Discover SA's Best{" "}
        <span className="text-[#009639]">Innovative</span>{" "}
        Projects
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
        South Africa's premier innovation competition. Showcase your project,
        get community votes, and win R500K in prizes.
      </p>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-5">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Try: AI, FinTech, mobile app, healthcare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 sm:pr-24 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] transition-colors shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            <Search className="w-3.5 h-3.5" /> Search
          </button>
        </form>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" /> Submit Your Project
        </Link>
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-purple-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="w-4 h-4" /> How it Works
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
