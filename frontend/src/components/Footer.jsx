import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {/* Discover */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] mb-4">Discover</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Categories</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Tracks</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Participants</Link>
              <Link to="/leaderboard" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Leaderboard</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Hall of Fame</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Top Rated</Link>
            </div>
          </div>

          {/* Compete */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] mb-4">Compete</h4>
            <div className="space-y-2.5">
              <Link to="/submit" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Submit Project</Link>
              <Link to="/how-it-works" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Rules</Link>
              <Link to="/how-it-works" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Timeline</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Prizes</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Judging Criteria</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] mb-4">Resources</h4>
            <div className="space-y-2.5">
              <Link to="/blog" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Blog</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Newsletter</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">FAQ</Link>
              <Link to="/how-it-works" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Vibe Coding Guide</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Workshops</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] mb-4">Organization</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">About</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Sponsors</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Partners</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Contact</Link>
            </div>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] mb-4">Legal</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Privacy</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Terms</Link>
            </div>
            <h4 className="text-sm font-bold text-[#111827] mb-3 mt-6">Social</h4>
            <div className="space-y-2.5">
              <a href="#" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">X / Twitter</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">LinkedIn</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-[#111827] transition-colors">Instagram</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#111827] rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#FFB612]" />
            </div>
            <span className="text-sm font-bold text-[#111827]">
              VibePush<span className="text-[#009639]"> SA</span>
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Vibe coding competition for South Africa's builders.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
