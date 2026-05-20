import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Trophy,
  Star,
  Medal,
  Calendar,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";

const RightSidebar = () => {
  const [stats, setStats] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, sponsorsRes, hofRes, blogRes] = await Promise.all([
          api.get("/stats"),
          api.get("/sponsors"),
          api.get("/hall-of-fame"),
          api.get("/blog"),
        ]);
        setStats(statsRes.data);
        setSponsors(sponsorsRes.data);
        setHallOfFame(hofRes.data.items || []);
        setBlogPosts(blogRes.data);
      } catch (err) {
        console.error("Failed to load sidebar data:", err);
      }
    };
    load();
  }, []);

  if (!stats) return null;

  return (
    <aside className="space-y-5">
      {/* Competition Stats */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#009639]" />
          <span className="text-sm font-bold text-[#111827]">Competition Stats</span>
        </div>
        <div className="text-2xl font-bold text-[#111827] mb-0.5">
          {stats.total_projects.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mb-3">Projects Submitted</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-[#111827]">{stats.total_votes.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500">Total Votes</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-[#111827]">{stats.total_participants.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500">Participants</div>
          </div>
        </div>
      </div>

      {/* Days Remaining */}
      <div className="bg-[#009639]/5 border border-[#009639]/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-[#009639]" />
          <span className="text-sm font-bold text-[#009639]">{stats.current_round}</span>
        </div>
        <div className="text-2xl font-bold text-[#009639]">{stats.days_remaining}</div>
        <div className="text-xs text-[#009639]/70">Days Remaining</div>
      </div>

      {/* Sponsors */}
      <div className="space-y-3">
        {sponsors.slice(0, 3).map((sponsor) => (
          <div key={sponsor.id} className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mb-2"
              style={{ backgroundColor: sponsor.color, color: sponsor.text_color }}
            >
              {sponsor.logo}
            </div>
            <span className="text-xs font-semibold text-[#111827]">{sponsor.name}</span>
            <span className="text-[10px] text-gray-500 text-center">{sponsor.description}</span>
          </div>
        ))}
      </div>

      {/* Hall of Fame */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-[#111827]">Hall of Fame</span>
        </div>
        <div className="space-y-3">
          {hallOfFame.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                {i === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                {i === 1 && <Star className="w-4 h-4 text-amber-500" />}
                {i === 2 && <Medal className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-[#111827]">{item.name}</div>
                <div className="text-[10px] text-gray-500">{item.award}</div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/leaderboard" className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-100 text-xs font-medium text-gray-500 hover:text-[#111827] transition-colors">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Sponsor CTA */}
      <div className="bg-[#111827] rounded-xl p-4 text-center">
        <Zap className="w-8 h-8 text-[#FFB612] mx-auto mb-2" />
        <div className="text-sm font-semibold text-white mb-1">Sponsor a Track</div>
        <div className="text-[10px] text-gray-400 mb-3">Get your brand in front of SA's best coders</div>
        <button className="px-4 py-1.5 text-xs font-medium text-[#111827] bg-[#FFB612] rounded-lg hover:bg-[#e6a410] transition-colors">
          Become a Sponsor
        </button>
      </div>

      {/* Latest from Blog */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-[#111827]">Latest Updates</span>
        </div>
        {blogPosts.slice(0, 2).map((post) => (
          <Link key={post.id} to="/blog" className="block mb-3 last:mb-0 group">
            <div className="text-xs font-medium text-[#111827] group-hover:text-[#009639] transition-colors line-clamp-2">
              {post.title}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{post.date}</div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
