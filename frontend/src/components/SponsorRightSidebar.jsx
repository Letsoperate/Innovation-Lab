import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

const logoMap = {
  "MTN Group": "/sponsors/mtn.png",
  "Standard Bank": "/sponsors/standard-bank.jpg",
  "Takealot": "/sponsors/takealot.png",
  "Investec": "/sponsors/investec.png",
  "Dimension Data": "/sponsors/dimension-data.jpg",
  "Naspers": "/sponsors/naspers.png",
};

const SponsorRightSidebar = () => {
  const [sponsors, setSponsors] = useState([]);
  const [indices, setIndices] = useState({});
  const timers = useRef({});

  useEffect(() => {
    api.get("/sponsors").then((res) => setSponsors(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (sponsors.length === 0) return;
    for (let i = 0; i < 4; i++) {
      timers.current[i] = setInterval(() => {
        setIndices((prev) => ({ ...prev, [i]: ((prev[i] || 0) + 1) % sponsors.length }));
      }, 3000 + Math.random() * 2000);
    }
    return () => Object.values(timers.current).forEach(clearInterval);
  }, [sponsors]);

  if (sponsors.length === 0) return null;
  const getSponsor = (i) => sponsors[((indices[i] || 0) + i) % sponsors.length];

  return (
    <aside className="flex flex-col justify-between h-full py-3 px-2 gap-2">
      {[0, 1, 2, 3].map((i) => {
        const s = getSponsor(i);
        const logoPath = logoMap[s.name];
        return (
          <a href={s.website || "#"} target="_blank" rel="noopener noreferrer" key={i} className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow cursor-pointer animate-fade-in flex-1">
            {logoPath ? (
              <img src={logoPath} alt={s.name} className="w-16 h-16 object-contain mb-2 rounded-lg" />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: s.color, color: s.text_color }}>
                <span className="text-xs font-bold">{s.logo}</span>
              </div>
            )}
            <span className="text-xs font-semibold text-purple-800 text-center leading-tight">{s.name}</span>
            <span className="text-[10px] text-gray-500 text-center leading-tight mt-1 line-clamp-2">{s.description}</span>
          </a>
        );
      })}
    </aside>
  );
};

export default SponsorRightSidebar;
