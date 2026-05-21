import React from "react";
import { X, Copy, Check } from "lucide-react";

const ShareModal = ({ projectName, projectId, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const url = `${window.location.origin}/?project=${projectId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform) => {
    const text = encodeURIComponent(`Check out ${projectName} on Innovation Lab!`);
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
    };
    window.open(links[platform], "_blank", "width=600,height=400");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-purple-800">Share Project</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4 truncate">{projectName}</p>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { key: "twitter", label: "X", color: "bg-black hover:bg-gray-800" },
            { key: "facebook", label: "FB", color: "bg-blue-600 hover:bg-blue-700" },
            { key: "linkedin", label: "in", color: "bg-blue-700 hover:bg-blue-800" },
            { key: "whatsapp", label: "WA", color: "bg-green-500 hover:bg-green-600" },
          ].map(s => (
            <button key={s.key} onClick={() => shareTo(s.key)}
              className={`${s.color} text-white text-xs font-bold w-full py-2.5 rounded-xl transition-colors`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
          <input readOnly value={url} className="flex-1 bg-transparent text-[10px] text-gray-600 outline-none truncate" />
          <button onClick={copyLink}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
