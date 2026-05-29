import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { ChevronUp, MessageCircle, Share2, Bookmark, Flame, Rocket, Play, Star, Calendar, Globe, Users } from "lucide-react";
import CommentModal from "../components/CommentModal";
import ShareModal from "../components/ShareModal";
import { useAuth } from "../context/AuthContext";

const ProjectPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(0);

  useEffect(() => {
    loadProject();
  }, [slug]);

  const loadProject = async () => {
    try {
      const res = await api.get(`/projects/slug/${encodeURIComponent(slug)}`);
      const p = res.data;
      if (p) {
        setProject(p);
        setCurrentUpvotes(p.upvotes);
        document.title = `${p.name} — Innovation Lab`;
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleVote = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/projects/${project.id}/vote`);
      setUpvoted(res.data.voted);
      setCurrentUpvotes(res.data.upvotes);
    } catch (err) { console.error(err); }
  };

  const handleBookmark = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/projects/${project.id}/bookmark`);
      setSaved(res.data.bookmarked);
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return <div className="w-full px-4 py-20 text-center"><div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" /></div>;
  }

  if (!project) {
    return <div className="w-full px-4 py-20 text-center"><p className="text-gray-500">Project not found.</p></div>;
  }

  const logoImage = project.logo_image || project.logoImage;
  const logoColor = project.logo_color || project.logoColor || "#009639";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden" style={{ backgroundColor: logoImage ? "transparent" : logoColor }}>
            {logoImage ? (
              <img src={logoImage} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">{project.logo_initial || project.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-purple-800 mb-1">{project.name}</h1>
            <p className="text-base text-gray-600 mb-3">{project.tagline}</p>
            <div className="flex items-center gap-4">
              <button onClick={handleVote} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${upvoted ? "bg-[#009639] text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}`}>
                <ChevronUp className="w-5 h-5" /> {currentUpvotes}
              </button>
              <button onClick={() => setShowComments(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">
                <MessageCircle className="w-4 h-4" /> Comments
              </button>
              <button onClick={handleBookmark} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl ${saved ? "bg-[#009639]/10 text-[#009639]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} /> {saved ? "Saved" : "Save"}
              </button>
              <button onClick={() => setShowShare(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-purple-800 mb-3">About this project</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Innovation Score", value: project.innovation_score, icon: <Rocket className="w-4 h-4" />, color: "text-[#009639]" },
            { label: "Rating", value: project.rating, icon: <Star className="w-4 h-4" />, color: "text-amber-500" },
            { label: "Category", value: project.category, icon: <Globe className="w-4 h-4" />, color: "text-purple-600" },
            { label: "Team Size", value: project.team_size, icon: <Users className="w-4 h-4" />, color: "text-blue-600" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className={`${s.color} mb-1`}>{s.icon}</div>
              <div className="text-lg font-bold text-purple-800">{s.value}</div>
              <div className="text-[10px] text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tech Stack & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-purple-800 mb-3">Tech Stack</h3>
            <p className="text-xs text-gray-600">{project.tech_stack || "Not specified"}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-purple-800 mb-3">Links</h3>
            <div className="space-y-2">
              {project.demo_url && <a href={project.demo_url} target="_blank" className="block text-xs text-[#009639] hover:underline">Demo</a>}
              {project.repo_url && <a href={project.repo_url} target="_blank" className="block text-xs text-[#009639] hover:underline">Repository</a>}
              {project.video_url && <a href={project.video_url} target="_blank" className="block text-xs text-[#009639] hover:underline">Video</a>}
              {!project.demo_url && !project.repo_url && !project.video_url && <span className="text-xs text-gray-400">No links provided</span>}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-bold text-purple-800 mb-3">Team</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">
              {(project.user_name || "U")[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-800">{project.user_name || "Unknown"}</div>
              <div className="text-[10px] text-gray-500">{project.institution} • {project.team_name}</div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-400">
          Submitted <Calendar className="w-3 h-3 inline mx-0.5" /> {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>

      {project && (
        <>
          <CommentModal projectId={project.id} projectName={project.name} projectUserId={project.user_id} isOpen={showComments} onClose={() => setShowComments(false)} />
          <ShareModal projectId={project.id} projectName={project.name} isOpen={showShare} onClose={() => setShowShare(false)} />
        </>
      )}
    </div>
  );
};

export default ProjectPage;
