import React from "react";
import { sponsors } from "../data/mock";

const SponsorSidebar = () => {
  return (
    <aside className="space-y-4">
      {sponsors.map((sponsor) => (
        <div
          key={sponsor.id}
          className="flex flex-col items-center p-3 cursor-pointer group"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold mb-2 group-hover:scale-105 transition-transform shadow-sm"
            style={{ backgroundColor: sponsor.color, color: sponsor.textColor }}
          >
            {sponsor.logo}
          </div>
          <span className="text-[11px] font-semibold text-[#111827] text-center leading-tight">
            {sponsor.name}
          </span>
          <span className="text-[10px] text-gray-500 text-center leading-tight mt-0.5">
            {sponsor.description}
          </span>
        </div>
      ))}
    </aside>
  );
};

export default SponsorSidebar;
