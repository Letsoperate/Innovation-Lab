import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { Search, FolderOpen, XCircle } from "lucide-react";
import { Spinner } from "@heroui/react";

const LIMIT = 12;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    const doSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/projects?search=${encodeURIComponent(query)}&page=${page}&limit=${LIMIT}`, { signal: controller.signal });
        setResults(res.data.projects || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search failed:", err);
          setError("Failed to search projects. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    doSearch();
    return () => controller.abort();
  }, [query, page]);

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
      ) : error ? (
        <div className="py-16 text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button onClick={() => setPage((p) => p)} className="text-sm text-purple-600 hover:underline">Try again</button>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="space-y-0 bg-white border border-gray-200 rounded-xl overflow-hidden">
            {results.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {total > LIMIT && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / LIMIT)}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / LIMIT)}
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
