import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { Avatar } from "@heroui/react";
import {
  User, School, Mail, Calendar, Edit3, Save, X, Bookmark, FolderOpen, Shield, Loader2, UserPlus, UserCheck, Users,
} from "lucide-react";

const ProfilePage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [myProjects, setMyProjects] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", institution: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [votedIds, setVotedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    loadData();
    loadFollowData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, bmRes, voteRes, bmIdsRes] = await Promise.all([
        api.get("/users/me/projects"), api.get("/bookmarks"), api.get("/votes/ids"), api.get("/bookmarks/ids"),
      ]);
      setMyProjects(projRes.data.projects || []);
      setBookmarks(bmRes.data.projects || []);
      setVotedIds(voteRes.data.ids || []);
      setBookmarkedIds(bmIdsRes.data.ids || []);
    } catch (err) { console.error("Failed to load profile data:", err); }
    finally { setLoading(false); }
  };

  const loadFollowData = async () => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const [fsRes, fgRes] = await Promise.all([
        api.get(`/users/${user.id}/followers`),
        api.get(`/users/${user.id}/following`),
      ]);
      setFollowers(fsRes.data || []);
      setFollowing(fgRes.data || []);
      setFollowersCount(fsRes.data?.length || 0);
      setFollowingCount(fgRes.data?.length || 0);
    } catch {}
  };

  const handleEdit = () => {
    setEditForm({ name: user?.name || "", institution: user?.institution || "", bio: user?.bio || "" });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await api.put("/auth/profile", editForm);
      setEditing(false);
      window.location.reload();
    } catch (err) { console.error("Failed to update profile:", err); }
    finally { setSaving(false); }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setMyProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) { console.error("Failed to delete project:", err); }
  };

  if (!user) {
    return <div className="w-full px-4 py-20 text-center"><p className="text-gray-500">Please log in to view your profile.</p></div>;
  }

  const tabs = [
    { id: "projects", label: "My Projects", icon: <FolderOpen className="w-4 h-4" />, count: myProjects.length },
    { id: "bookmarks", label: "Saved", icon: <Bookmark className="w-4 h-4" />, count: bookmarks.length },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar size="lg" className="w-20 h-20 rounded-2xl shrink-0">
            <Avatar.Fallback className="bg-[#009639] text-white text-2xl font-bold rounded-2xl">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Name</label>
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Institution</label>
                  <input value={editForm.institution} onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Bio</label>
                  <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#009639] rounded-lg hover:bg-[#007a2f] transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-purple-800">{user.name}</h1>
                  {user.is_admin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                {user.bio && <p className="text-sm text-gray-600 mb-2">{user.bio}</p>}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                  {user.institution && <span className="flex items-center gap-1"><School className="w-3 h-3" /> {user.institution}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FolderOpen className="w-3 h-3" /> <strong className="text-purple-800">{myProjects.length}</strong> Projects
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" /> <strong className="text-purple-800">{followersCount}</strong> Followers
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <strong className="text-purple-800">{followingCount}</strong> Following
                  </div>
                </div>
                {/* Followers avatars */}
                {followers.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex -space-x-1.5">
                      {followers.slice(0, 5).map((f) => (
                        <Avatar key={f.id} size="sm" className="w-7 h-7 ring-2 ring-white">
                          <Avatar.Fallback className="text-[9px] bg-purple-100 text-purple-700 rounded-full">{f.name?.charAt(0)}</Avatar.Fallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">Followed by {followers.map(f=>f.name).slice(0,2).join(", ")}{followers.length > 2 ? ` +${followers.length-2} more` : ""}</span>
                  </div>
                )}
              </>
            )}
          </div>
          {!editing && (
            <button onClick={handleEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? "border-purple-600 text-purple-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab.icon} {tab.label}
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">{tab.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center"><div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#009639] rounded-full animate-spin" /></div>
      ) : activeTab === "projects" ? (
        myProjects.length > 0 ? (
          <div>
            {myProjects.map((project) => (
              <div key={project.id} className="relative group">
                <ProjectCard project={project} isVoted={votedIds.includes(project.id)} isBookmarked={bookmarkedIds.includes(project.id)} />
                <button onClick={() => handleDeleteProject(project.id)}
                  className="absolute top-2 right-2 px-2 py-1 text-[10px] font-medium text-red-600 bg-red-50 border border-red-200 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100">Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">You haven't submitted any projects yet.</p>
            <button onClick={() => navigate("/submit")} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">Submit Your First Project</button>
          </div>
        )
      ) : (
        bookmarks.length > 0 ? (
          <div>{bookmarks.map((project) => <ProjectCard key={project.id} project={project} isBookmarked={true} />)}</div>
        ) : (
          <div className="py-16 text-center">
            <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No saved projects yet.</p>
          </div>
        )
      )}
    </div>
  );
};

export default ProfilePage;
