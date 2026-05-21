import React, { useState } from "react";
import {
  ChevronUp,
  MessageCircle,
  Share2,
  Bookmark,
  Flame,
  Ship,
  Play,
  Trophy,
  Medal,
  Award,
  Rocket,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CommentModal from "./CommentModal";
import ShareModal from "./ShareModal";

const getRankIcon = (rankLabel) => {
  if (!rankLabel) return null;
  if (rankLabel.includes("#1")) return <Trophy className="w-3 h-3" />;
  if (rankLabel.includes("#2")) return <Medal className="w-3 h-3" />;
  if (rankLabel.includes("#3")) return <Award className="w-3 h-3" />;
  return null;
};

const getRankColor = (rankLabel) => {
  if (!rankLabel) return "";
  if (rankLabel.includes("#1")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (rankLabel.includes("#2")) return "bg-gray-50 text-gray-600 border-gray-200";
  if (rankLabel.includes("#3")) return "bg-orange-50 text-orange-600 border-orange-200";
  return "";
};

const ProjectCard = ({ project, isVoted = false, isBookmarked = false, onVoteChange, onBookmarkChange }) => {
  const { user } = useAuth();
  const [upvoted, setUpvoted] = useState(isVoted);
  const [saved, setSaved] = useState(isBookmarked);
  const [currentUpvotes, setCurrentUpvotes] = useState(project.upvotes);
  const [voteLoading, setVoteLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleUpvote = async () => {
    if (!user) return;
    if (voteLoading) return;
    setVoteLoading(true);
    try {
      const res = await api.post(`/projects/${project.id}/vote`);
      setUpvoted(res.data.voted);
      setCurrentUpvotes(res.data.upvotes);
      if (onVoteChange) onVoteChange(project.id, res.data.voted);
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setVoteLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/projects/${project.id}/bookmark`);
      setSaved(res.data.bookmarked);
      if (onBookmarkChange) onBookmarkChange(project.id, res.data.bookmarked);
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  // Use the field names from API (snake_case)
  const categories = project.categories || [];
  const innovationScore = project.innovation_score || project.innovationScore || project.vibe_push_score || project.vibePushScore || 0;
  const isTrending = project.is_trending ?? project.isTrending ?? false;
  const hasVideo = project.has_video ?? project.hasVideo ?? false;
  const commentsCount = project.comments_count ?? project.comments ?? 0;
  const rankLabel = project.rank_label || project.rankLabel || "";
  const logoColor = project.logo_color || project.logoColor || "#009639";
  const logoInitial = project.logo_initial || project.logoInitial || project.name?.slice(0, 2).toUpperCase();
  const logoImage = project.logo_image || project.logoImage;

  return (
    <div className="group flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm overflow-hidden"
        style={{ backgroundColor: logoImage ? "transparent" : logoColor }}
      >
        {logoImage ? (
          <img src={logoImage} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          logoInitial
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-purple-800 truncate hover:underline cursor-pointer">
            {project.name}
          </h3>
          {isTrending && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 bg-orange-50 rounded">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-1 truncate">{project.tagline}</p>
        {(project.user_name || project.userName) && (
          <p className="text-[10px] text-gray-400 mb-1.5">by {project.user_name || project.userName}</p>
        )}

        <div className="flex items-center flex-wrap gap-1.5">
          {categories.map((cat, i) => (
            <span key={i} className="inline-block px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded">
              {cat}
            </span>
          ))}

          <button onClick={() => setShowComments(true)} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-500 cursor-pointer hover:text-purple-700">
            <MessageCircle className="w-3 h-3" /> {commentsCount > 0 ? commentsCount : "Comment"}
          </button>

          <button onClick={() => setShowShare(true)} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-500 hover:text-purple-700">
            <Share2 className="w-3 h-3" /> Share
          </button>

          <button
            onClick={handleBookmark}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] ${
              saved ? "text-[#009639]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bookmark className={`w-3 h-3 ${saved ? "fill-current" : ""}`} /> Save
          </button>

          {isTrending && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-orange-600">
              <Flame className="w-3 h-3" /> Trending
            </span>
          )}

          {hasVideo && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-blue-600">
              <Play className="w-3 h-3" /> Video
            </span>
          )}

          {project.rating > 0 && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-amber-600">
              <Ship className="w-3 h-3 fill-amber-400 text-amber-400" /> Rating {project.rating}
            </span>
          )}

          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-[#009639]">
            <Rocket className="w-3 h-3" /> {innovationScore} Innovation Score
          </span>

          {rankLabel && (
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold border rounded ${getRankColor(rankLabel)}`}>
              {getRankIcon(rankLabel)} {rankLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button
          onClick={handleUpvote}
          disabled={voteLoading}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border transition-colors ${
            upvoted
              ? "bg-[#009639]/10 border-[#009639]/30 text-[#009639]"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-xs font-semibold">{currentUpvotes}</span>
        </button>
        <span className="text-[10px] text-gray-400 mt-0.5">{project.views}</span>
      </div>

      <CommentModal
        projectId={project.id}
        projectName={project.name}
        projectUserId={project.user_id || project.userId}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
      <ShareModal
        projectId={project.id}
        projectName={project.name}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
};

export default ProjectCard;
