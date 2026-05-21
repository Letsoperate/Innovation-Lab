import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Calendar, Clock, ArrowRight, Rss } from "lucide-react";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blog")
      .then((res) => setBlogPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#009639]/10 text-[#009639] text-xs font-medium rounded-full mb-4">
          <Rss className="w-3 h-3" /> Competition Updates
        </div>
        <h1 className="text-3xl font-bold text-purple-800 mb-3">Blog & Updates</h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Stay up to date with competition news, project spotlights, tips, and announcements.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {blogPosts.map((post) => (
            <article key={post.id} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 text-[10px] font-medium text-[#009639] bg-[#009639]/10 rounded-full">{post.category}</span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3" /> {post.read_time}
                </span>
              </div>
              <h2 className="text-lg font-bold text-purple-800 mb-2 group-hover:text-[#009639] transition-colors">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{post.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#009639]">
                Read more <ArrowRight className="w-3 h-3" />
              </span>
            </article>
          ))}
        </div>
      )}

      <div className="mt-12 p-8 bg-purple-600 rounded-xl text-center max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-white mb-2">Stay in the Loop</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
          Get competition updates, project spotlights, and tips delivered to your inbox.
        </p>
        <div className="flex items-center max-w-sm mx-auto gap-2">
          <input type="email" placeholder="your@email.com"
            className="flex-1 h-10 px-3 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#009639]/40" />
          <button className="px-4 h-10 text-sm font-medium text-purple-800 bg-[#FFB612] rounded-lg hover:bg-[#e6a410] transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
