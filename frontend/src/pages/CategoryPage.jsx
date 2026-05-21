import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategory();
  }, [slug]);

  const loadCategory = async () => {
    try {
      const [catRes, projRes] = await Promise.all([
        api.get("/categories"),
        api.get(`/projects?category=${slug}&limit=100`),
      ]);
      const cat = catRes.data.find(c => c.slug === slug);
      setCategory(cat);
      setProjects(projRes.data.projects || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-800 mb-2">{category?.name || slug}</h1>
        <p className="text-sm text-gray-500 mb-6">{projects.length} projects</p>
        {loading ? (
          <div className="py-12 text-center"><div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" /></div>
        ) : projects.length > 0 ? (
          <div>{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>
        ) : (
          <div className="py-16 text-center text-gray-500 text-sm">No projects in this category yet.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
