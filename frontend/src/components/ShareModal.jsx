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
            { key: "twitter", label: "X", icon: "M10.05 14.22l-6.3 7.28H.96l7.26-8.39L.24 2h7.35l4.36 5.73L16.67 2h2.79l-6.81 7.87L20.16 22h-7.35l-4.81-6.39L3.37 22H.58l6.47-7.78h3Z", color: "bg-black hover:bg-gray-800" },
            { key: "facebook", label: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", color: "bg-[#1877F2] hover:bg-[#165DC7]" },
            { key: "linkedin", label: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", color: "bg-[#0A66C2] hover:bg-[#084E96]" },
            { key: "whatsapp", label: "WhatsApp", icon: "M20.47 3.53C18.23 1.28 15.23.1 12.05.1 5.5.1.1 5.5.1 12.05c0 2.12.55 4.18 1.59 5.97L0 24l6.13-1.62c1.73.94 3.71 1.44 5.72 1.44 6.55 0 11.94-5.39 11.94-11.94 0-3.18-1.28-6.18-3.32-8.35zM12.05 21.93c-1.78 0-3.52-.48-5.03-1.38l-.36-.22-3.64.96.97-3.55-.24-.38c-.99-1.58-1.51-3.41-1.51-5.32 0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.89a9.822 9.822 0 012.89 6.99c-.02 5.46-4.46 9.9-9.92 9.9zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.19 5.07 4.47.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z", color: "bg-[#25D366] hover:bg-[#1EA952]" },
          ].map(s => (
            <button key={s.key} onClick={() => shareTo(s.key)}
              className={`${s.color} text-white w-full py-2.5 rounded-xl transition-colors flex items-center justify-center`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.icon} /></svg>
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
