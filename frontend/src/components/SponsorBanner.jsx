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

const SponsorBanner = () => {
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
    <div className="w-full bg-purple-50 border-b border-gray-200 py-2 overflow-x-auto">
      <div className="flex items-center gap-2 px-4 min-w-max justify-center">
        {[0, 1, 2, 3].map((i) => {
          const s = getSponsor(i);
          const logoPath = logoMap[s.name];
          return (
            <div key={i} className="flex flex-col items-center p-2 bg-white border border-gray-200 rounded-xl shadow-sm min-w-[110px] animate-fade-in shrink-0">
              {logoPath ? (
                <img src={logoPath} alt={s.name} className="w-12 h-12 object-contain mb-1 rounded-lg" />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: s.color, color: s.text_color }}>
                  <span className="text-xs font-bold">{s.logo}</span>
                </div>
              )}
              <span className="text-[10px] font-semibold text-purple-800 text-center truncate w-full">{s.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorBanner;
