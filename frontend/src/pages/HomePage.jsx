import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import BrowseSidebar from "../components/BrowseSidebar";
import RightSidebar from "../components/RightSidebar";
import SponsorSidebar from "../components/SponsorSidebar";
import ProjectCard from "../components/ProjectCard";
import FAQSection from "../components/FAQSection";
import {
  todayTopProjects,
  yesterdayTopProjects,
  weekTopProjects,
  monthTopProjects,
  todayLaunches,
} from "../data/mock";
import { Flame, Clock, TrendingUp, RefreshCw, Tag } from "lucide-react";

const tabs = [
  { id: "top", label: "Top", icon: null },
  { id: "live", label: "Live", icon: "live" },
  { id: "recent", label: "Recent", icon: null },
  { id: "updated", label: "Updated", icon: null },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("top");

  const renderProjectSection = (title, projects) => (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#111827] mb-4">{title}</h2>
      <div className="space-y-0">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
      <div className="flex gap-0">
        {/* Far Left - Sponsor Sidebar */}
        <div className="hidden xl:block w-[180px] shrink-0 pt-6">
          <SponsorSidebar />
        </div>

        {/* Left - Browse Sidebar */}
        <div className="hidden lg:block w-[200px] shrink-0 pt-6 pl-4">
          <BrowseSidebar />
        </div>

        {/* Center - Main Content */}
        <div className="flex-1 min-w-0 pt-6 px-4 lg:px-6">
          <HeroSection />

          {/* Tabs */}
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

          {/* Project Listings */}
          {activeTab === "top" && (
            <>
              {renderProjectSection("Today Top 4", todayTopProjects)}
              {renderProjectSection("Yesterday Top 4", yesterdayTopProjects)}
              {renderProjectSection("This Week Top 2", weekTopProjects)}
              {renderProjectSection("This Month Top 2", monthTopProjects)}
            </>
          )}

          {activeTab === "live" && (
            <>{renderProjectSection("Today's Launches", todayLaunches)}</>
          )}

          {activeTab === "recent" && (
            <>{renderProjectSection("Recent Submissions", [...todayLaunches, ...todayTopProjects].slice(0, 8))}</>
          )}

          {activeTab === "updated" && (
            <>{renderProjectSection("Recently Updated", [...yesterdayTopProjects, ...weekTopProjects])}</>
          )}

          {/* FAQ */}
          <FAQSection />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[260px] shrink-0 pt-6">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
