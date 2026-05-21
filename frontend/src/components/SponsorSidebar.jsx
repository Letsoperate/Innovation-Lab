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

const SponsorSidebar = () => {
  const [sponsors, setSponsors] = useState([]);
  const [indices, setIndices] = useState({});
  const timers = useRef({});

  useEffect(() => {
    api.get("/sponsors").then((res) => setSponsors(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (sponsors.length === 0) return;
    for (let i = 0; i < 5; i++) {
      timers.current[i] = setInterval(() => {
        setIndices((prev) => ({ ...prev, [i]: ((prev[i] || 0) + 1) % (sponsors.length + 1) }));
      }, 3000 + Math.random() * 2000);
    }
    return () => Object.values(timers.current).forEach(clearInterval);
  }, [sponsors]);

  if (sponsors.length === 0) return null;

  const items = [];
  for (let i = 0; i < 4; i++) {
    const idx = (indices[i] || 0);
    if (idx === sponsors.length) {
      items.push({ isAd: true, key: `ad-${i}` });
    } else {
      items.push({ isAd: false, key: i, sponsor: sponsors[(idx + i) % sponsors.length] });
    }
  }

  return (
    <aside className="flex flex-col justify-between h-full py-3 px-2 gap-2">
      {items.map((item) => {
        if (item.isAd) {
          return (
            <div key={item.key} className="flex flex-col items-center justify-center p-4 bg-purple-100 border border-purple-300 border-dashed rounded-xl cursor-pointer hover:bg-purple-200 transition-colors animate-fade-in flex-1">
              <svg width="44" height="44" viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" className="mb-1.5">
                <path d="M 200,80 L 180,80 L 180,240 L 200,240" fill="none" stroke="#534AB7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M 480,80 L 500,80 L 500,240 L 480,240" fill="none" stroke="#1D9E75" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="340" y="185" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="100" fontWeight="700" letterSpacing="-2" fill="#2C2C2A">ILab</text>
              </svg>
              <span className="text-xs font-semibold text-purple-700">Advertise here</span>
              <span className="text-[10px] text-purple-500 mt-0.5">Promote your product</span>
            </div>
          );
        }
        const s = item.sponsor;
        const logoPath = logoMap[s.name];
        return (
          <div key={item.key} className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow cursor-pointer animate-fade-in flex-1">
            {logoPath ? (
              <img src={logoPath} alt={s.name} className="w-16 h-16 object-contain mb-2 rounded-lg" />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: s.color, color: s.text_color }}>
                <span className="text-xs font-bold">{s.logo}</span>
              </div>
            )}
            <span className="text-xs font-semibold text-purple-800 text-center leading-tight">{s.name}</span>
            <span className="text-[10px] text-gray-500 text-center leading-tight mt-1 line-clamp-2">{s.description}</span>
          </div>
        );
      })}
    </aside>
  );
};

export default SponsorSidebar;
