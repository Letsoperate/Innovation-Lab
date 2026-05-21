import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {/* Discover */}
          <div>
            <h4 className="text-sm font-bold text-purple-800 mb-4">Discover</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Categories</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Tracks</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Participants</Link>
              <Link to="/leaderboard" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Leaderboard</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Hall of Fame</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Top Rated</Link>
            </div>
          </div>

          {/* Compete */}
          <div>
            <h4 className="text-sm font-bold text-purple-800 mb-4">Compete</h4>
            <div className="space-y-2.5">
              <Link to="/submit" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Submit Project</Link>
              <Link to="/how-it-works" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Rules</Link>
              <Link to="/how-it-works" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Timeline</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Prizes</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Judging Criteria</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-purple-800 mb-4">Resources</h4>
            <div className="space-y-2.5">
              <Link to="/blog" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Blog</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Newsletter</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">FAQ</Link>
              <Link to="/how-it-works" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Innovation Guide</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Workshops</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-purple-800 mb-4">Organization</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">About</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Sponsors</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Partners</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-sm font-bold text-purple-800 mb-4">Legal</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Privacy</Link>
              <Link to="/" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Terms</Link>
            </div>
            <h4 className="text-sm font-bold text-purple-800 mb-3 mt-6">Social</h4>
            <div className="space-y-2.5">
              <a href="#" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">X / Twitter</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">LinkedIn</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-purple-800 transition-colors">Instagram</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-purple-800">
              Innovation<span className="text-[#1D9E75]"> Lab</span>
            </span>
          </div>
          <span className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Innovation Lab. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
