import React, { useState } from "react";
import { categories, tracks, institutions } from "../data/mock";
import {
  Upload,
  Image,
  Video,
  Link2,
  Users,
  School,
  Tag,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const SubmitPage = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    tagline: "",
    description: "",
    demoUrl: "",
    repoUrl: "",
    videoUrl: "",
    category: "",
    track: "",
    institution: "",
    teamName: "",
    teamSize: "1",
    techStack: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#009639]/10 text-[#009639] text-xs font-medium rounded-full mb-4">
          <Upload className="w-3 h-3" /> Submit Entry
        </div>
        <h1 className="text-3xl font-bold text-[#111827] mb-3">
          Submit Your Project
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Showcase your vibe-coded project to the community. Fill in the details
          below and your project goes live for voting.
        </p>
      </div>

      {submitted && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-[#009639]/10 border border-[#009639]/20 rounded-xl">
          <CheckCircle className="w-5 h-5 text-[#009639] shrink-0" />
          <div>
            <div className="text-sm font-semibold text-[#009639]">Project Submitted!</div>
            <div className="text-xs text-[#009639]/70">Your project is now live for community voting.</div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Info */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#009639]" /> Project Details
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Project Name *</label>
            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              placeholder="e.g., MediTrack AI"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Tagline *</label>
            <input
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              required
              placeholder="A short description of your project"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tell us about your project, what problem it solves, and how you built it..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Tech Stack</label>
            <input
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="e.g., React, Python, TensorFlow, MongoDB"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>
        </div>

        {/* Links */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#009639]" /> Links
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Demo URL *</label>
            <input
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              required
              placeholder="https://your-demo.com"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Repository URL</label>
            <input
              name="repoUrl"
              value={formData.repoUrl}
              onChange={handleChange}
              placeholder="https://github.com/your-project"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" /> Demo Video URL
              </span>
            </label>
            <input
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>
        </div>

        {/* Category & Track */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#009639]" /> Classification
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Competition Track *</label>
            <select
              name="track"
              value={formData.track}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] bg-white"
            >
              <option value="">Select a track</option>
              {tracks.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Team Info */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#009639]" /> Team Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Team Name *</label>
            <input
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              required
              placeholder="Your team name"
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Team Size</label>
            <select
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] bg-white"
            >
              <option value="1">Solo (1 member)</option>
              <option value="2">Duo (2 members)</option>
              <option value="3">Trio (3 members)</option>
              <option value="4">Quad (4 members)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1">
                <School className="w-3 h-3" /> Institution *
              </span>
            </label>
            <select
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] bg-white"
            >
              <option value="">Select your institution</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 leading-relaxed">
            <strong>Note:</strong> Your project will be publicly visible immediately after submission. You can edit your submission at any time before the voting deadline. Make sure your demo is accessible and working.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 text-sm font-semibold text-white bg-[#111827] rounded-xl hover:bg-[#1f2937] transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" /> Submit Project
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;
