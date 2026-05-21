import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Shield,
  Users,
  FolderOpen,
  ChevronUp,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Trash2,
  Ship,
  Rss,
  Plus,
  Edit3,
  X,
  Save,
  Loader2,
  Rocket,
  BarChart3,
  Calendar,
  Award,
} from "lucide-react";

const AdminPage = () => {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogModal, setBlogModal] = useState({ open: false, mode: "create", data: null });
  const [sponsorModal, setSponsorModal] = useState({ open: false, mode: "create", data: null });
  const [blogForm, setBlogForm] = useState({ title: "", excerpt: "", content: "", category: "", read_time: "" });
  const [sponsorForm, setSponsorForm] = useState({ name: "", description: "", logo: "", color: "#009639", text_color: "#fff" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user?.is_admin) {
      navigate("/admin/login");
      return;
    }
    loadTab(activeTab);
  }, [token, user, authLoading]);

  useEffect(() => {
    if (user?.is_admin) loadTab(activeTab);
  }, [activeTab]);

  const loadTab = async (tab) => {
    setLoading(true);
    try {
      switch (tab) {
        case "dashboard":
          const dRes = await api.get("/admin/dashboard");
          setDashboard(dRes.data);
          break;
        case "users":
          const uRes = await api.get("/admin/users");
          setUsers(uRes.data.users || []);
          break;
        case "projects":
          const pRes = await api.get("/admin/projects");
          setProjects(pRes.data.projects || []);
          break;
        case "blog":
          const bRes = await api.get("/blog");
          setBlogPosts(bRes.data);
          break;
        case "sponsors":
          const sRes = await api.get("/sponsors");
          setSponsors(sRes.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-admin`);
      loadTab("users");
    } catch (err) { console.error(err); }
  };

  const handleBlogSave = async () => {
    setSaving(true);
    try {
      if (blogModal.mode === "create") {
        await api.post("/admin/blog", blogForm);
      } else {
        await api.put(`/admin/blog/${blogModal.data.id}`, blogForm);
      }
      setBlogModal({ open: false, mode: "create", data: null });
      loadTab("blog");
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleBlogDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await api.delete(`/admin/blog/${id}`);
      loadTab("blog");
    } catch (err) { console.error(err); }
  };

  const handleSponsorSave = async () => {
    setSaving(true);
    try {
      if (sponsorModal.mode === "create") {
        await api.post("/admin/sponsors", sponsorForm);
      } else {
        await api.put(`/admin/sponsors/${sponsorModal.data.id}`, sponsorForm);
      }
      setSponsorModal({ open: false, mode: "create", data: null });
      loadTab("sponsors");
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleSponsorDelete = async (id) => {
    if (!window.confirm("Delete this sponsor?")) return;
    try {
      await api.delete(`/admin/sponsors/${id}`);
      loadTab("sponsors");
    } catch (err) { console.error(err); }
  };

  if (!user?.is_admin) {
    return (
      <div className="w-full px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Admin access required.</p>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" /> },
    { id: "blog", label: "Blog", icon: <Rss className="w-4 h-4" /> },
    { id: "sponsors", label: "Sponsors", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#FFB612]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-purple-800">Admin Panel</h1>
          <p className="text-xs text-gray-500">Manage Innovation Lab competition</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? "border-purple-600 text-purple-800" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Dashboard */}
          {activeTab === "dashboard" && dashboard && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Projects", value: dashboard.total_projects, icon: <FolderOpen className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
                  { label: "Users", value: dashboard.total_users, icon: <Users className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
                  { label: "Votes", value: dashboard.total_votes, icon: <ChevronUp className="w-5 h-5" />, color: "text-purple-600 bg-purple-50" },
                  { label: "Comments", value: dashboard.total_comments, icon: <MessageCircle className="w-5 h-5" />, color: "text-orange-600 bg-orange-50" },
                ].map((stat) => (
                  <div key={stat.label} className="p-5 bg-white border border-gray-200 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-purple-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[#009639]/5 border border-[#009639]/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-[#009639]">{dashboard.projects_today}</div>
                  <div className="text-xs text-[#009639]/70">Projects Today</div>
                </div>
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <div className="text-2xl font-bold text-amber-700">{dashboard.votes_today}</div>
                  <div className="text-xs text-amber-600">Votes Today</div>
                </div>
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-700">{dashboard.users_today}</div>
                  <div className="text-xs text-blue-600">New Users Today</div>
                </div>
              </div>
              {dashboard.top_categories?.length > 0 && (
                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                  <h3 className="text-sm font-bold text-purple-800 mb-4">Top Categories</h3>
                  <div className="space-y-2">
                    {dashboard.top_categories.map((c, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{c.category || "Uncategorized"}</span>
                        <span className="text-sm font-semibold text-purple-800">{c.count} projects</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_120px_120px_80px] gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                <div>User</div><div>Institution</div><div>Projects</div><div>Role</div>
              </div>
              {users.map((u) => (
                <div key={u.id} className="grid grid-cols-[1fr_120px_120px_80px] gap-2 px-4 py-3 items-center border-b border-gray-50 hover:bg-gray-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <img src={u.avatar_url} alt={u.name} className="w-7 h-7 rounded-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                      <div>
                        <div className="text-sm font-medium text-purple-800">{u.name}</div>
                        <div className="text-[10px] text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 truncate">{u.institution || "—"}</div>
                  <div className="text-xs font-medium text-purple-800">{u.project_count}</div>
                  <div>
                    <button
                      onClick={() => handleToggleAdmin(u.id)}
                      className={`px-2 py-1 text-[10px] font-medium rounded ${
                        u.is_admin ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.is_admin ? "Admin" : "User"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {activeTab === "projects" && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_80px_80px_60px] gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                <div>Project</div><div className="text-center">Votes</div><div className="text-center">Score</div><div className="text-center">Views</div><div></div>
              </div>
              {projects.map((p) => (
                <div key={p.id} className="grid grid-cols-[1fr_80px_80px_80px_60px] gap-2 px-4 py-3 items-center border-b border-gray-50 hover:bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: p.logo_color }}>
                      {p.logo_initial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-purple-800 truncate">{p.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{p.institution} • {p.team_name}</div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium text-purple-800">{p.upvotes}</div>
                  <div className="text-center text-sm font-medium text-[#009639]">{p.innovation_score ?? p.vibe_push_score}</div>
                  <div className="text-center text-xs text-gray-500">{p.views}</div>
                  <div className="text-center">
                    <button onClick={() => handleDeleteProject(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blog */}
          {activeTab === "blog" && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => {
                  setBlogForm({ title: "", excerpt: "", content: "", category: "", read_time: "" });
                  setBlogModal({ open: true, mode: "create", data: null });
                }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New Post
                </button>
              </div>
              <div className="space-y-3">
                {blogPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-purple-800 truncate">{post.title}</div>
                      <div className="text-[10px] text-gray-500">{post.category} • {post.date}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button onClick={() => {
                        setBlogForm({ title: post.title, excerpt: post.excerpt, content: post.content || "", category: post.category, read_time: post.read_time });
                        setBlogModal({ open: true, mode: "edit", data: post });
                      }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleBlogDelete(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsors */}
          {activeTab === "sponsors" && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => {
                  setSponsorForm({ name: "", description: "", logo: "", color: "#009639", text_color: "#fff" });
                  setSponsorModal({ open: true, mode: "create", data: null });
                }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New Sponsor
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((s) => (
                  <div key={s.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: s.color, color: s.text_color }}>
                        {s.logo}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => {
                          setSponsorForm({ name: s.name, description: s.description, logo: s.logo, color: s.color, text_color: s.text_color });
                          setSponsorModal({ open: true, mode: "edit", data: s });
                        }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleSponsorDelete(s.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-purple-800">{s.name}</div>
                    <div className="text-[10px] text-gray-500">{s.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Blog Modal */}
      {blogModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setBlogModal({ open: false, mode: "create", data: null })}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-purple-800">{blogModal.mode === "create" ? "New Blog Post" : "Edit Blog Post"}</h2>
              <button onClick={() => setBlogModal({ open: false, mode: "create", data: null })} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-700 mb-1 block">Title *</label>
                <input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]" /></div>
              <div><label className="text-xs font-medium text-gray-700 mb-1 block">Excerpt</label>
                <textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] resize-none" /></div>
              <div><label className="text-xs font-medium text-gray-700 mb-1 block">Content</label>
                <textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639] resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
                  <input value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20" /></div>
                <div><label className="text-xs font-medium text-gray-700 mb-1 block">Read Time</label>
                  <input value={blogForm.read_time} onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })} placeholder="e.g. 5 min read" className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20" /></div>
              </div>
              <button onClick={handleBlogSave} disabled={saving || !blogForm.title} className="w-full h-10 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {blogModal.mode === "create" ? "Create Post" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Modal */}
      {sponsorModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSponsorModal({ open: false, mode: "create", data: null })}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-purple-800">{sponsorModal.mode === "create" ? "New Sponsor" : "Edit Sponsor"}</h2>
              <button onClick={() => setSponsorModal({ open: false, mode: "create", data: null })} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-700 mb-1 block">Name *</label>
                <input value={sponsorForm.name} onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]" /></div>
              <div><label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                <input value={sponsorForm.description} onChange={(e) => setSponsorForm({ ...sponsorForm, description: e.target.value })} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20" /></div>
              <div><label className="text-xs font-medium text-gray-700 mb-1 block">Logo Text (2-3 chars)</label>
                <input value={sponsorForm.logo} onChange={(e) => setSponsorForm({ ...sponsorForm, logo: e.target.value })} maxLength={3} className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-700 mb-1 block">Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={sponsorForm.color} onChange={(e) => setSponsorForm({ ...sponsorForm, color: e.target.value })} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                    <input value={sponsorForm.color} onChange={(e) => setSponsorForm({ ...sponsorForm, color: e.target.value })} className="flex-1 h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                  </div>
                </div>
                <div><label className="text-xs font-medium text-gray-700 mb-1 block">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={sponsorForm.text_color} onChange={(e) => setSponsorForm({ ...sponsorForm, text_color: e.target.value })} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                    <input value={sponsorForm.text_color} onChange={(e) => setSponsorForm({ ...sponsorForm, text_color: e.target.value })} className="flex-1 h-10 px-3 text-sm border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <div className="text-[10px] text-gray-400 mb-2">Preview</div>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold mx-auto" style={{ backgroundColor: sponsorForm.color, color: sponsorForm.text_color }}>{sponsorForm.logo || "?"}</div>
                <div className="text-xs font-semibold text-purple-800 mt-2">{sponsorForm.name || "Sponsor Name"}</div>
              </div>
              <button onClick={handleSponsorSave} disabled={saving || !sponsorForm.name} className="w-full h-10 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {sponsorModal.mode === "create" ? "Add Sponsor" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
