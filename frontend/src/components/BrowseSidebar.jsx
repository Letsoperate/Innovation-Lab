import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Zap, ChevronRight } from "lucide-react";

const BrowseSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [audiences, setAudiences] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, trackRes, audRes] = await Promise.all([
          api.get("/categories"),
          api.get("/tracks"),
          api.get("/audiences"),
        ]);
        setCategories(catRes.data);
        setTracks(trackRes.data);
        setAudiences(audRes.data);
      } catch (err) {
        console.error("Failed to load browse data:", err);
      }
    };
    load();
  }, []);

  return (
    <aside className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-[#009639]" />
        <span className="text-sm font-bold text-[#111827]">Browse</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#009639] uppercase tracking-wider">Categories</span>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {categories.slice(0, 7).map((cat) => (
            <Link key={cat.id} to="/" className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#009639] uppercase tracking-wider">Tracks</span>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {tracks.map((track) => (
            <Link key={track.id} to="/" className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors">
              {track.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#009639] uppercase tracking-wider">Participants</span>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0.5">
          {audiences.map((aud) => (
            <Link key={aud.id} to="/" className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors">
              {aud.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BrowseSidebar;
