import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Building2, ChevronUp, Ship, Rocket, TrendingUp, LogOut, Award } from "lucide-react";

const sponsorLogoMap = {
  "MTN Group": "/sponsors/mtn.png",
  "Standard Bank": "/sponsors/standard-bank.jpg",
  "Takealot": "/sponsors/takealot.png",
  "Investec": "/sponsors/investec.png",
  "Dimension Data": "/sponsors/dimension-data.jpg",
  "Naspers": "/sponsors/naspers.png",
};

const SponsorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("sponsorToken");
  const name = localStorage.getItem("sponsorName") || "Sponsor";

  useEffect(() => {
    if (!token) { navigate("/sponsor/login"); return; }
    loadData();
    loadVotes();
  }, []);

  const loadData = async () => {
    try {
      const [projRes, statsRes] = await Promise.all([
        api.get("/projects?limit=100"),
        api.get("/stats"),
      ]);
      setProjects(projRes.data.projects || []);
      setStats(statsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadVotes = async () => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.get("/votes/ids");
      setVotedIds(res.data.ids || []);
    } catch {}
  };

  const handleVote = async (projectId) => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.post(`/projects/${projectId}/vote`);
      if (res.data.voted) {
        setVotedIds((prev) => [...prev, projectId]);
      } else {
        setVotedIds((prev) => prev.filter((id) => id !== projectId));
      }
      loadData();
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.removeItem("sponsorToken");
    localStorage.removeItem("sponsorName");
    localStorage.removeItem("sponsorId");
    navigate("/sponsor/login");
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sponsorLogoMap[name] ? (
              <img src={sponsorLogoMap[name]} alt={name} className="w-7 h-7 rounded-lg object-contain" />
            ) : (
              <Building2 className="w-5 h-5 text-purple-600" />
            )}
            <span className="text-sm font-bold text-purple-800">{name} Dashboard</span>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Projects", value: stats.total_projects, color: "bg-purple-100 text-purple-700" },
              { label: "Votes", value: stats.total_votes?.toLocaleString(), color: "bg-green-100 text-green-700" },
              { label: "Participants", value: stats.total_participants, color: "bg-amber-100 text-amber-700" },
              { label: "Days Left", value: stats.days_remaining, color: "bg-blue-100 text-blue-700" },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="text-lg font-bold text-purple-800">{s.value}</div>
                <div className="text-[10px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Vote on Projects
        </h2>

        {loading ? (
          <div className="py-12 text-center"><div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 30).map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: project.logo_image ? "transparent" : (project.logo_color || "#009639") }}>
                  {project.logo_image ? (
                    <img src={project.logo_image} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-bold">{project.logo_initial}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-purple-800 truncate">{project.name}</h4>
                    {project.is_trending && <span className="px-1.5 py-0.5 text-[9px] font-medium text-orange-600 bg-orange-50 rounded">Hot</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{project.tagline}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><ChevronUp className="w-3 h-3" /> {project.upvotes}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Star className="w-3 h-3" /> {project.rating}</span>
                    <span className="text-[10px] text-[#009639] flex items-center gap-1"><Zap className="w-3 h-3" /> {project.innovation_score}</span>
                  </div>
                </div>
                <button onClick={() => handleVote(project.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    votedIds.includes(project.id)
                      ? "bg-[#009639] text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}>
                  <ChevronUp className="w-3.5 h-3.5" />
                  {votedIds.includes(project.id) ? "Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorDashboard;
