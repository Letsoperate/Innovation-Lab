import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Trophy, Ship, Medal, Award, Calendar, ArrowRight } from "lucide-react";

const medalIcons = [
  <Trophy className="w-5 h-5 text-amber-500" />,
  <Ship className="w-5 h-5 text-gray-500" />,
  <Medal className="w-5 h-5 text-orange-500" />,
];

const HallOfFamePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/hall-of-fame")
      .then((res) => setItems(res.data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full mb-4">
            <Trophy className="w-3 h-3" /> Hall of Fame
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-3">Hall of Fame</h1>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Celebrating the best projects and teams that have won Innovation Lab awards over the years.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 bg-white border rounded-xl transition-shadow hover:shadow-md ${
                i === 0 ? "border-amber-200 bg-gradient-to-r from-amber-50 to-white" :
                i === 1 ? "border-gray-200" :
                i === 2 ? "border-orange-100" : "border-gray-200"
              }`}>
                <div className="flex items-center gap-3 shrink-0">
                  {i < 3 ? (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      i === 0 ? "bg-amber-100" : i === 1 ? "bg-gray-100" : "bg-orange-50"
                    }`}>
                      {medalIcons[i]}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: item.logo_image ? "transparent" : (item.logo_color || "#009639") }}>
                    {item.logo_image ? (
                      <img src={item.logo_image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{item.logo_initial || item.name?.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-purple-800">{item.name}</h3>
                    {i < 3 && (
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        i === 0 ? "bg-amber-100 text-amber-700" :
                        i === 1 ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {i === 0 ? "Gold" : i === 1 ? "Silver" : "Bronze"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> {item.award}
                    </span>
                    {item.date_won && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.date_won}
                      </span>
                    )}
                  </div>
                </div>
                <Link to={`/?project=${item.id}`} className="hidden sm:flex items-center gap-1 shrink-0 px-3 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-16 text-center text-gray-500 text-sm">No Hall of Fame entries yet.</div>
            )}
          </div>
        )}

        <div className="text-center mt-12 p-6 bg-purple-50 rounded-xl">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-purple-800 mb-1">Want to see your project here?</h3>
          <p className="text-xs text-gray-600 mb-4">Submit your project, get community votes, and earn your place in the Hall of Fame.</p>
          <Link to="/submit" className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors">
            Submit Your Project <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HallOfFamePage;
