import React, { useState, useEffect } from "react";
import { X, Search, GitBranch, Star } from "lucide-react";

const GitHubRepoModal = ({ isOpen, onClose, onSelect, githubAccessToken }) => {
  const [repos, setRepos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !githubAccessToken) return;
    setLoading(true);
    setError("");
    fetch("https://api.github.com/user/repos?per_page=100&sort=updated&type=owner", {
      headers: { Authorization: `Bearer ${githubAccessToken}`, Accept: "application/vnd.github+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch repos");
        return res.json();
      })
      .then((data) => { setRepos(data); setFiltered(data); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, githubAccessToken]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(repos); return; }
    const q = search.toLowerCase();
    setFiltered(repos.filter((r) => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))));
  }, [search, repos]);

  if (!isOpen) return null;

  const handleSelect = (repo) => {
    onSelect({
      name: repo.name,
      tagline: repo.description ? repo.description.slice(0, 100) : "",
      description: repo.description || "",
      repo_url: repo.html_url,
      tech_stack: repo.language || "",
      homepage: repo.homepage || "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-purple-800">Import from GitHub</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select a repository to import</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search repositories..."
              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {loading && <div className="flex items-center justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div><span className="ml-2 text-sm text-gray-500">Fetching repos...</span></div>}
          {error && <div className="text-center py-12"><p className="text-sm text-red-600">{error}</p></div>}
          {!loading && !error && filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-500">No repositories found</p></div>}
          {!loading && !error && filtered.map((repo) => (
            <div key={repo.id} onClick={() => handleSelect(repo)} className="p-3 border border-gray-200 rounded-xl hover:border-purple-500/30 hover:bg-purple-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-purple-800 truncate">{repo.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{repo.description || "No description"}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {repo.language && <span className="text-[10px] text-gray-500 flex items-center gap-1"><GitBranch className="w-3 h-3" /> {repo.language}</span>}
                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
                  </div>
                </div>
                <button className="ml-3 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shrink-0">Select</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubRepoModal;
