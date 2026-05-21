import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Trophy, Ship, Medal, Calendar, ArrowRight, Rocket, TrendingUp } from "lucide-react";

const COMPETITION_END = new Date(new Date().getFullYear(), 7, 15, 23, 59, 59);

const RightSidebar = () => {
  const [stats, setStats] = useState(null);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, hofRes, blogRes] = await Promise.all([
          api.get("/stats"), api.get("/hall-of-fame"), api.get("/blog"),
        ]);
        setStats(statsRes.data);
        setHallOfFame(hofRes.data.items || []);
        setBlogPosts(blogRes.data);
        const usersRes = await api.get("/users");
        setUsers(usersRes.data || []);
      } catch (err) { console.error("Failed to load sidebar data:", err); }
    };
    load();
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = COMPETITION_END - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!stats) return null;

  return (
    <aside className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#009639]" />
          <span className="text-xs font-bold text-purple-800">Competition Stats</span>
        </div>
        <div className="text-xl font-bold text-purple-800 mb-0.5">{stats.total_projects.toLocaleString()}</div>
        <div className="text-[10px] text-gray-500 mb-2">Projects Submitted</div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-bold text-purple-800">{stats.total_votes.toLocaleString()}</div>
            <div className="text-[9px] text-gray-500">Total Votes</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center -space-x-1.5 mb-1">
              {users.slice(0, 4).map(u => (
                <img key={u.id} src={u.avatar_url} alt={u.name} className="w-5 h-5 rounded-full ring-1 ring-white object-cover" />
              ))}
              {users.length > 4 && <span className="w-5 h-5 rounded-full bg-purple-100 text-[8px] font-bold text-purple-600 flex items-center justify-center ring-1 ring-white">+{users.length-4}</span>}
            </div>
            <div className="text-[9px] text-gray-500">{users.length} Participants</div>
          </div>
        </div>
      </div>

      {/* Live Countdown */}
      <div className="bg-[#009639]/5 border border-[#009639]/20 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#009639]" />
          <span className="text-xs font-bold text-[#009639]">Finals Countdown</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <div className="bg-white rounded-lg p-1.5">
            <div className="text-base font-bold text-[#009639]">{String(countdown.days).padStart(2, "0")}</div>
            <div className="text-[8px] text-gray-500">Days</div>
          </div>
          <div className="bg-white rounded-lg p-1.5">
            <div className="text-base font-bold text-[#009639]">{String(countdown.hours).padStart(2, "0")}</div>
            <div className="text-[8px] text-gray-500">Hrs</div>
          </div>
          <div className="bg-white rounded-lg p-1.5">
            <div className="text-base font-bold text-[#009639]">{String(countdown.mins).padStart(2, "0")}</div>
            <div className="text-[8px] text-gray-500">Min</div>
          </div>
          <div className="bg-white rounded-lg p-1.5">
            <div className="text-base font-bold text-[#009639]">{String(countdown.secs).padStart(2, "0")}</div>
            <div className="text-[8px] text-gray-500">Sec</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-purple-800">Hall of Fame</span>
        </div>
        <div className="space-y-2">
          {hallOfFame.slice(0, 10).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: item.logo_color || "#009639" }}>
                {item.logo_image ? (
                  <img src={item.logo_image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                    {item.logo_initial || item.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                {i === 0 && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                {i === 1 && <Ship className="w-3.5 h-3.5 text-amber-500" />}
                {i === 2 && <Medal className="w-3.5 h-3.5 text-amber-500" />}
                {i > 2 && <span className="text-[9px] font-bold text-amber-500">{i + 1}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold text-purple-800 truncate">{item.name}</div>
                <div className="text-[9px] text-gray-500">{item.award} {item.date_won && <span className="text-[8px]">· {item.date_won}</span>}</div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/leaderboard" className="flex items-center justify-center gap-1 mt-2 pt-2 border-t border-gray-100 text-[10px] font-medium text-gray-500 hover:text-purple-800 transition-colors">
          View all <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>
      <div className="bg-purple-600 rounded-xl p-3 text-center">
        <Rocket className="w-6 h-6 text-[#FFB612] mx-auto mb-1.5" />
        <div className="text-xs font-semibold text-white mb-0.5">Sponsor a Track</div>
        <div className="text-[9px] text-gray-300 mb-2">Get your brand in front of SA's best coders</div>
        <button className="px-3 py-1 text-[10px] font-medium text-purple-800 bg-[#FFB612] rounded-lg hover:bg-[#e6a410] transition-colors">Become a Sponsor</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-bold text-purple-800">Latest Updates</span>
        </div>
        {blogPosts.slice(0, 2).map((post) => (
          <Link key={post.id} to="/blog" className="block mb-2 last:mb-0 group">
            <div className="text-[11px] font-medium text-purple-800 group-hover:text-[#009639] transition-colors line-clamp-2">{post.title}</div>
            <div className="text-[9px] text-gray-400 mt-0.5">{post.date}</div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
