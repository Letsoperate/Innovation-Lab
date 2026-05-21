import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import BrowseSidebar from "../components/BrowseSidebar";
import RightSidebar from "../components/RightSidebar";
import SponsorSidebar from "../components/SponsorSidebar";
import SponsorRightSidebar from "../components/SponsorRightSidebar";
import SponsorBanner from "../components/SponsorBanner";
import ProjectCard from "../components/ProjectCard";
import FAQSection from "../components/FAQSection";
import api from "../services/api";
import { Tabs, Spinner, Skeleton } from "@heroui/react";

const tabs = [
  { id: "top", label: "Top", icon: null },
  { id: "live", label: "Live", icon: "live" },
  { id: "recent", label: "Recent", icon: null },
  { id: "updated", label: "Updated", icon: null },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("top");
  const [grouped, setGrouped] = useState({ today: [], yesterday: [], week: [], month: [], all: [] });
  const [listProjects, setListProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => { loadData(); loadUserState(); }, []);
  useEffect(() => { if (activeTab !== "top") loadTabProjects(activeTab); }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try { const res = await api.get("/projects/grouped"); setGrouped(res.data); }
    catch (err) { console.error("Failed to load projects:", err); }
    finally { setLoading(false); }
  };

  const loadTabProjects = async (tab) => {
    setLoading(true);
    try {       const res = await api.get(`/projects?tab=${tab}&limit=50`); setListProjects(res.data.projects || []); }
    catch (err) { console.error("Failed to load projects:", err); }
    finally { setLoading(false); }
  };

  const loadUserState = async () => {
    try {
      const [votesRes, bookmarksRes] = await Promise.all([api.get("/votes/ids"), api.get("/bookmarks/ids")]);
      setVotedIds(votesRes.data.ids || []);
      setBookmarkedIds(bookmarksRes.data.ids || []);
    } catch {}
  };

  const handleVoteChange = (projectId, voted) => {
    setVotedIds((prev) => voted ? [...prev, projectId] : prev.filter((id) => id !== projectId));
  };

  const handleBookmarkChange = (projectId, bookmarked) => {
    setBookmarkedIds((prev) => bookmarked ? [...prev, projectId] : prev.filter((id) => id !== projectId));
  };

  const renderProjectSection = (title, projects) => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-purple-800 mb-4">{title}</h2>
      <div className="space-y-0">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project}
            isVoted={votedIds.includes(project.id)} isBookmarked={bookmarkedIds.includes(project.id)}
            onVoteChange={handleVoteChange} onBookmarkChange={handleBookmarkChange} />
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="py-4 space-y-4">
      <div className="flex flex-col items-center gap-2 mb-4">
        <Spinner size="lg" color="success" />
        <p className="text-sm text-gray-500">Loading projects...</p>
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="flex items-start gap-3 p-4 border-b border-gray-100">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="w-14 h-16 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );

  const projectBoard = (
    <>
      <HeroSection />
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(String(key))}
        className="mb-6"
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Projects" className="flex items-center gap-1 border-b border-gray-200">
            {tabs.map(t => (
              <Tabs.Tab key={t.id} id={t.id} className="text-sm font-medium px-4 py-3 border-b-2 border-transparent data-[selected=true]:border-purple-600 data-[selected=true]:text-purple-800 text-gray-500">
                {t.icon === "live" && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block mr-1.5" />}
                {t.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="top">
          {loading ? renderLoading() : (
            <>
              {grouped.today.length > 0 && renderProjectSection(`Today Top ${grouped.today.length}`, grouped.today)}
              {grouped.yesterday.length > 0 && renderProjectSection(`Yesterday Top ${grouped.yesterday.length}`, grouped.yesterday)}
              {grouped.week.length > 0 && renderProjectSection(`This Week Top ${grouped.week.length}`, grouped.week)}
              {grouped.month.length > 0 && renderProjectSection(`This Month Top ${grouped.month.length}`, grouped.month)}
              {grouped.all && grouped.all.length > 0 && renderProjectSection(`Older Projects`, grouped.all)}
            </>
          )}
        </Tabs.Panel>
        <Tabs.Panel id="live">
          {loading ? renderLoading() : listProjects.length > 0 ? renderProjectSection("Today's Launches", listProjects) : <div className="py-12 text-center text-gray-500 text-sm">No projects found.</div>}
        </Tabs.Panel>
        <Tabs.Panel id="recent">
          {loading ? renderLoading() : listProjects.length > 0 ? renderProjectSection("Recent Submissions", listProjects) : <div className="py-12 text-center text-gray-500 text-sm">No projects found.</div>}
        </Tabs.Panel>
        <Tabs.Panel id="updated">
          {loading ? renderLoading() : listProjects.length > 0 ? renderProjectSection("Recently Updated", listProjects) : <div className="py-12 text-center text-gray-500 text-sm">No projects found.</div>}
        </Tabs.Panel>
      </Tabs>
      <FAQSection />
    </>
  );

  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col">
      {/* Sponsor Banner — visible on mobile/tablet */}
      <div className="lg:hidden">
        <SponsorBanner />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex gap-3 lg:gap-4 overflow-hidden px-0 sm:px-2 lg:px-4">
        {/* Far Left: Sponsors — xl only */}
        <div className="hidden xl:flex w-[15%] shrink-0 pt-6 animate-slide-left overflow-y-auto bg-purple-50">
          <SponsorSidebar />
        </div>

        {/* Left: Browse — lg+ */}
        <div className="hidden lg:flex w-[15%] shrink-0 pt-6 pl-3 animate-slide-left delay-100 overflow-y-auto">
          <BrowseSidebar />
        </div>

        {/* Center: Project board */}
        <div className="flex-1 lg:w-[40%] lg:max-w-[600px] pt-6 px-3 lg:px-4 overflow-y-auto animate-fade-in scroll-smooth mx-auto">
          {projectBoard}
        </div>

        {/* Right: Stats — lg+ */}
        <div className="hidden lg:flex w-[15%] shrink-0 pt-6 animate-slide-right overflow-y-auto">
          <RightSidebar />
        </div>

        {/* Far Right: Sponsors — xl only */}
        <div className="hidden xl:flex w-[15%] shrink-0 pt-6 animate-slide-right overflow-y-auto bg-purple-50">
          <SponsorRightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
