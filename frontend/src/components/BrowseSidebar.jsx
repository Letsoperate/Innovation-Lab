import React from "react";
import { Link } from "react-router-dom";
import { categories, tracks, audiences } from "../data/mock";
import { Zap, ChevronRight } from "lucide-react";

const BrowseSidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-[#009639]" />
        <span className="text-sm font-bold text-[#111827]">Browse</span>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#009639] uppercase tracking-wider">
            Categories
          </span>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {categories.slice(0, 7).map((cat) => (
            <Link
              key={cat.slug}
              to="/"
              className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#009639] uppercase tracking-wider">
            Tracks
          </span>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {tracks.map((track) => (
            <Link
              key={track.slug}
              to="/"
              className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors"
            >
              {track.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Audiences */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#009639] uppercase tracking-wider">
            Participants
          </span>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {audiences.map((aud) => (
            <Link
              key={aud.slug}
              to="/"
              className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors"
            >
              {aud.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BrowseSidebar;
