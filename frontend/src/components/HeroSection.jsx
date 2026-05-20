import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, ArrowRight, Trophy } from "lucide-react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
          <Sparkles className="w-3 h-3" /> Rules
        </Link>
        <Link
          to="/blog"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-3 h-3" /> Blog
        </Link>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-3 leading-tight">
        Discover SA's Best{" "}
        <span className="text-[#009639]">Vibe-Coded</span>{" "}
        Projects
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
        South Africa's premier vibe coding competition. Showcase your project,
        get community votes, and win R500K in prizes.
      </p>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Try: AI, FinTech, mobile app, healthcare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-24 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] transition-colors shadow-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#111827] rounded-lg hover:bg-[#1f2937] transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> Search
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#111827] rounded-xl hover:bg-[#1f2937] transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> Submit Your Project
        </Link>
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#111827] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="w-4 h-4" /> How it Works
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
