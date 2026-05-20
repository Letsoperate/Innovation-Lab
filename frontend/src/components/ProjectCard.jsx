import React, { useState } from "react";
import {
  ChevronUp,
  MessageCircle,
  Share2,
  Bookmark,
  Flame,
  Star,
  Play,
  Trophy,
  Medal,
  Award,
  Zap,
} from "lucide-react";

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

const ProjectCard = ({ project }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(project.upvotes);

  const handleUpvote = () => {
    if (upvoted) {
      setCurrentUpvotes((prev) => prev - 1);
    } else {
      setCurrentUpvotes((prev) => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  return (
    <div className="group flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Project Logo */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
        style={{ backgroundColor: project.logoColor }}
      >
        {project.logoInitial}
      </div>

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#111827] truncate hover:underline cursor-pointer">
            {project.name}
          </h3>
          {project.isTrending && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 bg-orange-50 rounded">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2 truncate">
          {project.tagline}
        </p>

        {/* Tags and Actions */}
        <div className="flex items-center flex-wrap gap-1.5">
          {project.categories.map((cat, i) => (
            <span
              key={i}
              className="inline-block px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded"
            >
              {cat}
            </span>
          ))}

          {project.comments > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer">
              <MessageCircle className="w-3 h-3" /> {project.comments}
            </span>
          )}

          <button className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-700">
            <Share2 className="w-3 h-3" /> Share
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] ${
              saved ? "text-[#009639]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bookmark className={`w-3 h-3 ${saved ? "fill-current" : ""}`} /> Save
          </button>

          {project.isTrending && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-orange-600">
              <Flame className="w-3 h-3" /> Trending
            </span>
          )}

          {project.hasVideo && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-blue-600">
              <Play className="w-3 h-3" /> Video
            </span>
          )}

          {project.rating > 0 && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-amber-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Rating {project.rating}
            </span>
          )}

          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-[#009639]">
            <Zap className="w-3 h-3" /> {project.vibePushScore} VibePush
          </span>

          {project.rankLabel && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold border rounded ${
                getRankColor(project.rankLabel)
              }`}
            >
              {getRankIcon(project.rankLabel)} {project.rankLabel}
            </span>
          )}
        </div>
      </div>

      {/* Upvote Section */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button
          onClick={handleUpvote}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border transition-colors ${
            upvoted
              ? "bg-[#009639]/10 border-[#009639]/30 text-[#009639]"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-xs font-semibold">{currentUpvotes}</span>
        </button>
        <span className="text-[10px] text-gray-400 mt-0.5">{project.views}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
