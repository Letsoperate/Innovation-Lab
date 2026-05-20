import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import BrowseSidebar from "../components/BrowseSidebar";
import RightSidebar from "../components/RightSidebar";
import SponsorSidebar from "../components/SponsorSidebar";
import ProjectCard from "../components/ProjectCard";
import FAQSection from "../components/FAQSection";
import api from "../services/api";

const tabs = [
  { id: "top", label: "Top", icon: null },
  { id: "live", label: "Live", icon: "live" },
  { id: "recent", label: "Recent", icon: null },
  { id: "updated", label: "Updated", icon: null },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("top");
  const [grouped, setGrouped] = useState({ today: [], yesterday: [], week: [], month: [] });
  const [listProjects, setListProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    loadData();
    loadUserState();
  }, []);

  useEffect(() => {
    if (activeTab !== "top") {
      loadTabProjects(activeTab);
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects/grouped");
      setGrouped(res.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTabProjects = async (tab) => {
    setLoading(true);
    try {
      const res = await api.get(`/projects?tab=${tab}&limit=20`);
      setListProjects(res.data.projects || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserState = async () => {
    try {
      const [votesRes, bookmarksRes] = await Promise.all([
        api.get("/votes/ids"),
        api.get("/bookmarks/ids"),
      ]);
      setVotedIds(votesRes.data.ids || []);
      setBookmarkedIds(bookmarksRes.data.ids || []);
    } catch {
      // Not logged in, ignore
    }
  };

  const handleVoteChange = (projectId, voted) => {
    setVotedIds((prev) =>
      voted ? [...prev, projectId] : prev.filter((id) => id !== projectId)
    );
  };

  const handleBookmarkChange = (projectId, bookmarked) => {
    setBookmarkedIds((prev) =>
      bookmarked ? [...prev, projectId] : prev.filter((id) => id !== projectId)
    );
  };

  const renderProjectSection = (title, projects) => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#111827] mb-4">{title}</h2>
      <div className="space-y-0">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isVoted={votedIds.includes(project.id)}
            isBookmarked={bookmarkedIds.includes(project.id)}
            onVoteChange={handleVoteChange}
            onBookmarkChange={handleBookmarkChange}
          />
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="py-12 text-center">
      <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" />
      <p className="text-sm text-gray-500 mt-2">Loading projects...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
      <div className="flex gap-0">
        <div className="hidden xl:block w-[180px] shrink-0 pt-6">
          <SponsorSidebar />
        </div>

        <div className="hidden lg:block w-[200px] shrink-0 pt-6 pl-4">
          <BrowseSidebar />
        </div>

        <div className="flex-1 min-w-0 pt-6 px-4 lg:px-6">
          <HeroSection />

          <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#111827] text-[#111827]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon === "live" && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            renderLoading()
          ) : activeTab === "top" ? (
            <>
              {grouped.today.length > 0 && renderProjectSection(`Today Top ${grouped.today.length}`, grouped.today)}
              {grouped.yesterday.length > 0 && renderProjectSection(`Yesterday Top ${grouped.yesterday.length}`, grouped.yesterday)}
              {grouped.week.length > 0 && renderProjectSection(`This Week Top ${grouped.week.length}`, grouped.week)}
              {grouped.month.length > 0 && renderProjectSection(`This Month Top ${grouped.month.length}`, grouped.month)}
              {grouped.today.length === 0 && grouped.yesterday.length === 0 && grouped.week.length === 0 && grouped.month.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-sm">No projects found yet.</div>
              )}
            </>
          ) : (
            <>
              {listProjects.length > 0 ? (
                renderProjectSection(
                  activeTab === "live" ? "Today's Launches" : activeTab === "recent" ? "Recent Submissions" : "Recently Updated",
                  listProjects
                )
              ) : (
                <div className="py-12 text-center text-gray-500 text-sm">No projects found.</div>
              )}
            </>
          )}

          <FAQSection />
        </div>

        <div className="hidden lg:block w-[260px] shrink-0 pt-6">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
