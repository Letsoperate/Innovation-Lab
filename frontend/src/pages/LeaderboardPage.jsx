import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Trophy,
  Medal,
  Award,
  Ship,
  ChevronUp,
  Flame,
  Rocket,
  Filter,
} from "lucide-react";

const timeFilters = ["All Time", "This Month", "This Week", "Today"];
const periodMap = { "All Time": "all", "This Month": "month", "This Week": "week", "Today": "today" };

const LeaderboardPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = "Leaderboard — Innovation Lab"; }, []);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadLeaderboard(periodMap[activeFilter]);
  }, [activeFilter]);

  const loadStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const loadLeaderboard = async (period) => {
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard?period=${period}`);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (index) => {
    if (index === 0)
      return (
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
      );
    if (index === 1)
      return (
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <Medal className="w-5 h-5 text-gray-500" />
        </div>
      );
    if (index === 2)
      return (
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
          <Award className="w-5 h-5 text-orange-500" />
        </div>
      );
    return (
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-sm font-bold text-gray-400">
        {index + 1}
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full mb-4">
          <Trophy className="w-3 h-3" /> Rankings
        </div>
        <h1 className="text-3xl font-bold text-purple-800 mb-3">Leaderboard</h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Top-ranked projects in the Innovation Lab competition. Rankings update in real-time based on community votes.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
            <div className="text-lg font-bold text-purple-800">{stats.total_projects}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Projects</div>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
            <div className="text-lg font-bold text-purple-800">{stats.total_votes.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Total Votes</div>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
            <div className="text-lg font-bold text-purple-800">{stats.total_participants.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Participants</div>
          </div>
          <div className="p-4 bg-[#009639]/5 border border-[#009639]/20 rounded-xl text-center">
            <div className="text-lg font-bold text-[#009639]">{stats.days_remaining}</div>
            <div className="text-[10px] text-[#009639]/70 mt-0.5">Days Left</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-gray-400 shrink-0" />
        {timeFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === filter ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_80px_80px_80px] sm:grid-cols-[60px_1fr_100px_100px_100px] gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-[10px] font-bold text-gray-500 uppercase">Rank</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase">Project</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase text-center">Votes</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase text-center">Rating</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase text-center">Score</div>
          </div>

          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`grid grid-cols-[60px_1fr_80px_80px_80px] sm:grid-cols-[60px_1fr_100px_100px_100px] gap-2 px-4 py-3 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                index === 0 ? "bg-amber-50/30" : ""
              }`}
            >
              <div className="flex justify-center">{getRankDisplay(index)}</div>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: project.logo_image ? "transparent" : (project.logo_color || "#009639") }}>
                  {project.logo_image ? (
                    <img src={project.logo_image} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-bold">{project.logo_initial}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold text-purple-800 truncate">{project.name}</h4>
                    {project.is_trending && <Flame className="w-3 h-3 text-orange-500 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{project.institution}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-sm font-semibold text-purple-800">
                  <ChevronUp className="w-3 h-3" /> {project.upvotes}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                {project.rating > 0 ? (
                  <>
                    <Ship className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-purple-800">{project.rating}</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-1">
                <Rocket className="w-3 h-3 text-[#009639]" />
                <span className="text-sm font-bold text-[#009639]">{project.innovation_score ?? project.vibe_push_score}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        Rankings are calculated based on upvotes, comments, ratings, and community engagement.
      </p>
    </div>
  );
};

export default LeaderboardPage;
