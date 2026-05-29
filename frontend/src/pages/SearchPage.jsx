import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { Search, FolderOpen } from "lucide-react";
import { Spinner } from "@heroui/react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query) {
      setPage(1);
      search(query, 1);
    }
  }, [query]);

  useEffect(() => {
    if (query && page > 0) search(query, page);
  }, [page]);

  const search = async (q, p) => {
    setLoading(true);
    try {
      const res = await api.get(`/projects?search=${encodeURIComponent(q)}&page=${p}&limit=12`);
      setResults(res.data.projects || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-purple-600" />
        <h1 className="text-xl font-bold text-purple-800">
          Search results for "{query}"
        </h1>
        <span className="text-sm text-gray-500">{total} projects found</span>
      </div>

      {loading ? (
        <div className="py-16 text-center"><Spinner size="lg" color="success" /></div>
      ) : results.length > 0 ? (
        <>
          <div className="space-y-0 bg-white border border-gray-200 rounded-xl overflow-hidden">
            {results.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {total > 12 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 12)}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No projects found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
