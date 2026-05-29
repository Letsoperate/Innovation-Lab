import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => { document.title = "Category  - Innovation Lab"; }, []);

  useEffect(() => {
    loadProjects(currentPage);
  }, [slug, currentPage]);

  const loadProjects = async (page = 1) => {
    setLoading(true);
    try {
      const [catRes, projRes] = await Promise.all([
        api.get("/categories"),
        api.get(`/projects?category=${slug}&page=${page}&limit=${PAGE_SIZE}`),
      ]);
      const cat = catRes.data.find(c => c.slug === slug);
      setCategory(cat);
      setProjects(projRes.data.projects || []);
      setTotalProjects(projRes.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const Pagination = ({ page, total, pageSize, onPageChange }) => {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-800 mb-2">{category?.name || slug}</h1>
        <p className="text-sm text-gray-500 mb-6">{totalProjects} projects</p>
        {loading ? (
          <div className="py-12 text-center"><div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" /></div>
        ) : projects.length > 0 ? (
          <div>
            <div>{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>
            <Pagination page={currentPage} total={totalProjects} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 text-sm">No projects in this category yet.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
