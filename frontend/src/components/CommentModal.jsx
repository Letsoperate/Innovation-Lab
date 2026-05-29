import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { X, Send } from "lucide-react";

const CommentModal = ({ projectId, projectName, projectUserId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setError(false);
      api.get(`/projects/${projectId}/comments`)
        .then(res => setComments(res.data || []))
        .catch(() => { setError(true); setComments([]); });
    }
  }, [isOpen, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !token) return;
    setLoading(true);
    try {
      const res = await api.post(`/projects/${projectId}/comments`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(prev => [res.data, ...prev]);
      toast.success("Comment posted!");
      setText("");
    } catch (err) {
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl mx-4 max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-purple-800">Comments</h3>
            <p className="text-[10px] text-gray-500">{projectName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 ? (
            error ? (
              <p className="text-xs text-red-400 text-center py-8">Failed to load comments. Please try again.</p>
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">No comments yet. Be the first!</p>
            )
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700 shrink-0">
                  {(c.user_name || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link to={`/profile/${c.user_id}`} className="text-[11px] font-semibold text-purple-800 hover:underline">
                      {c.user_name || "Anonymous"}
                    </Link>
                    {c.user_id === projectUserId && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold text-[#009639] bg-[#009639]/10 rounded">Author</span>
                    )}
                    <span className="text-[9px] text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {token ? (
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={text} onChange={e => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 h-9 px-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <button type="submit" disabled={loading || !text.trim()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1">
              <Send className="w-3 h-3" /> Post
            </button>
          </form>
        ) : (
          <div className="p-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Log in to join the conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
