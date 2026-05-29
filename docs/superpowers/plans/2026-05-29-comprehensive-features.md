# Comprehensive Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 20+ production features across backend and frontend: error boundaries, toast notifications, search, pagination, skeletons, form validation, input sanitization, rate limiting, voting/bookmark UX, admin moderation, profile completeness, SEO, and more.

**Architecture:** Each task is self-contained and produces working, testable software. Backend tasks add endpoints/DTOs. Frontend tasks add components or modify existing pages. Tasks are ordered by dependency — later tasks may depend on earlier ones.

**Tech Stack:** Spring Boot 3.4, Java 21, React 19, Tailwind CSS, HeroUI, Lucide icons, framer-motion

---

## Phase 1: Foundation (Error Handling + Toast System)

### Task 1: Error Boundary Component

**Files:**
- Create: `frontend/src/components/ErrorBoundary.jsx`
- Modify: `frontend/src/App.js`

- [ ] **Step 1: Create ErrorBoundary component**

```jsx
// frontend/src/components/ErrorBoundary.jsx
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-purple-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

- [ ] **Step 2: Wrap App routes with ErrorBoundary**

Modify `frontend/src/App.js` — add import and wrap Routes:

```jsx
import ErrorBoundary from "./components/ErrorBoundary";

// Inside App(), wrap Routes:
<ErrorBoundary>
  <Routes>
    {/* ...existing routes... */}
  </Routes>
</ErrorBoundary>
```

- [ ] **Step 3: Verify frontend builds**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`
Expected: Build succeeds (or pre-existing @/index.css error only)

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ErrorBoundary.jsx frontend/src/App.js
git commit -m "feat: add error boundary component wrapping app routes"
```

---

### Task 2: Toast Notification System

**Files:**
- Create: `frontend/src/context/ToastContext.jsx`
- Create: `frontend/src/components/Toast.jsx`
- Modify: `frontend/src/App.js`

- [ ] **Step 1: Create ToastContext**

```jsx
// frontend/src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-[#009639]" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
};

const BG_COLORS = {
  success: "border-[#009639]/30 bg-[#009639]/5",
  error: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-blue-200 bg-blue-50",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-20 right-4 z-[200] space-y-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in-right ${BG_COLORS[t.type]}`}
          >
            {ICONS[t.type]}
            <span className="text-sm text-gray-700 flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="p-0.5 hover:bg-black/5 rounded">
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
```

- [ ] **Step 2: Add slide-in-right animation to index.css**

Append to `frontend/src/index.css`:

```css
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out both;
}
```

- [ ] **Step 3: Wrap App with ToastProvider**

Modify `frontend/src/App.js`:

```jsx
import { ToastProvider } from "./context/ToastContext";

// Inside App(), wrap inside AuthProvider:
<AuthProvider>
  <ToastProvider>
    <BrowserRouter>
      {/* ... */}
    </BrowserRouter>
  </ToastProvider>
</AuthProvider>
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/context/ToastContext.jsx frontend/src/App.js frontend/src/index.css
git commit -m "feat: add toast notification system with success/error/warning/info"
```

---

### Task 3: Wire Toasts into Existing Components

**Files:**
- Modify: `frontend/src/components/ProjectCard.jsx`
- Modify: `frontend/src/pages/ProfilePage.jsx`
- Modify: `frontend/src/components/CommentModal.jsx`
- Modify: `frontend/src/pages/AdminPage.jsx`

- [ ] **Step 1: Add toast to ProjectCard vote/bookmark**

In `ProjectCard.jsx`, add `import { useToast } from "../context/ToastContext";` and `const toast = useToast();`

Replace the catch blocks:

```jsx
// In handleUpvote catch:
catch (err) {
  toast.error("Failed to vote. Please try again.");
}

// In handleBookmark catch:
catch (err) {
  toast.error("Failed to save. Please try again.");
}

// After successful vote:
if (res.data.voted) toast.success("Vote added!");
else toast.info("Vote removed");

// After successful bookmark:
if (res.data.bookmarked) toast.success("Project saved!");
else toast.info("Removed from saved");
```

- [ ] **Step 2: Add toast to ProfilePage follow/save**

In `ProfilePage.jsx`, add toast import and wire:

```jsx
// In handleFollow catch:
catch (err) {
  toast.error("Failed to follow. Please try again.");
}

// After successful follow:
toast.success(isFollowing ? "Unfollowed" : "Following!");

// In handleSave catch:
catch (err) {
  toast.error("Failed to update profile.");
}

// After successful save:
toast.success("Profile updated!");
```

- [ ] **Step 3: Add toast to CommentModal**

In `CommentModal.jsx`, add toast import and wire:

```jsx
// In handleSubmit catch:
catch (err) {
  toast.error("Failed to post comment.");
}

// In useEffect catch:
.catch(() => { toast.error("Failed to load comments."); setComments([]); });
```

- [ ] **Step 4: Add toast to AdminPage**

In `AdminPage.jsx`, add toast import and wire all catch blocks:

```jsx
// In handleDeleteProject:
catch (err) { toast.error("Failed to delete project."); }

// In handleToggleAdmin:
catch (err) { toast.error("Failed to toggle admin status."); }
// After success:
toast.success("Admin status updated!");

// In handleBlogSave:
catch (err) { toast.error("Failed to save blog post."); }
// After success:
toast.success(blogModal.mode === "create" ? "Post created!" : "Post updated!");

// In handleSponsorSave:
catch (err) { toast.error("Failed to save sponsor."); }
// After success:
toast.success(sponsorModal.mode === "create" ? "Sponsor added!" : "Sponsor updated!");

// In handleBlogDelete/handleSponsorDelete catch:
catch (err) { toast.error("Failed to delete."); }
// After success:
toast.success("Deleted successfully!");
```

- [ ] **Step 5: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/ProjectCard.jsx frontend/src/pages/ProfilePage.jsx frontend/src/components/CommentModal.jsx frontend/src/pages/AdminPage.jsx
git commit -m "feat: wire toast notifications into all user-facing actions"
```

---

## Phase 2: Search + Pagination

### Task 4: Working Search Bar + Search Results Page

**Files:**
- Modify: `frontend/src/components/HeroSection.jsx`
- Create: `frontend/src/pages/SearchPage.jsx`
- Modify: `frontend/src/App.js`

- [ ] **Step 1: Create SearchPage**

```jsx
// frontend/src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { Search, FolderOpen } from "lucide-react";
import { Spinner } from "@heroui/react";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query) search(query, page);
  }, [query, page]);

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
```

- [ ] **Step 2: Add search route to App.js**

```jsx
import SearchPage from "./pages/SearchPage";

// In Routes:
<Route path="/search" element={<SearchPage />} />
```

- [ ] **Step 3: Wire HeroSection search to navigate**

Replace HeroSection.jsx search bar:

```jsx
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // In the search bar section, wrap in <form onSubmit={handleSearch}>:
  // Add type="submit" to the button
  // Add onKeyDown handler to input for Enter key
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/HeroSection.jsx frontend/src/pages/SearchPage.jsx frontend/src/App.js
git commit -m "feat: functional search bar with search results page and pagination"
```

---

### Task 5: Pagination on HomePage

**Files:**
- Modify: `frontend/src/pages/HomePage.jsx`

- [ ] **Step 1: Add pagination to tab-based views**

In `HomePage.jsx`, modify `loadTabProjects` to track total and support page changes:

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [totalProjects, setTotalProjects] = useState(0);
const PAGE_SIZE = 12;

const loadTabProjects = async (tab, page = 1) => {
  setLoading(true);
  try {
    const res = await api.get(`/projects?tab=${tab}&page=${page}&limit=${PAGE_SIZE}`);
    setListProjects(res.data.projects || []);
    setTotalProjects(res.data.total || 0);
  } catch (err) { console.error("Failed to load projects:", err); }
  finally { setLoading(false); }
};

// Update tab change handler:
useEffect(() => {
  if (activeTab !== "top") {
    setCurrentPage(1);
    loadTabProjects(activeTab, 1);
  }
}, [activeTab]);

// Add pagination UI after renderProjectSection calls in each tab panel
```

- [ ] **Step 2: Create a reusable Pagination component**

```jsx
// Inside HomePage.jsx (or create separate file):
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
```

- [ ] **Step 3: Add pagination to each tab panel**

After the `renderProjectSection` call in each non-top tab panel, add:

```jsx
<Pagination page={currentPage} total={totalProjects} pageSize={PAGE_SIZE}
  onPageChange={(p) => { setCurrentPage(p); loadTabProjects(activeTab, p); }} />
```

- [ ] **Step 4: Verify build**

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/HomePage.jsx
git commit -m "feat: add pagination to HomePage tab views"
```

---

### Task 6: Pagination on CategoryPage

**Files:**
- Modify: `frontend/src/pages/CategoryPage.jsx`

- [ ] **Step 1: Read CategoryPage to understand current structure**

(Read file first, then add pagination following same pattern as Task 5)

- [ ] **Step 2: Add pagination with PAGE_SIZE = 12**

Replace hardcoded `limit=100` with paginated loading:

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [totalProjects, setTotalProjects] = useState(0);
const PAGE_SIZE = 12;

const loadProjects = async (page = 1) => {
  setLoading(true);
  try {
    const res = await api.get(`/projects?category=${slug}&page=${page}&limit=${PAGE_SIZE}`);
    setProjects(res.data.projects || []);
    setTotalProjects(res.data.total || 0);
  } catch (err) { console.error(err); }
  finally { setLoading(false); }
};
```

- [ ] **Step 3: Add pagination UI at bottom**

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/CategoryPage.jsx
git commit -m "feat: add pagination to CategoryPage"
```

---

## Phase 3: Loading Skeletons

### Task 7: Skeleton Components for All Pages

**Files:**
- Create: `frontend/src/components/skeletons/ProjectCardSkeleton.jsx`
- Create: `frontend/src/components/skeletons/ProfileSkeleton.jsx`
- Create: `frontend/src/components/skeletons/SidebarSkeleton.jsx`
- Modify: `frontend/src/pages/ProjectPage.jsx`
- Modify: `frontend/src/pages/ProfilePage.jsx`
- Modify: `frontend/src/components/RightSidebar.jsx`

- [ ] **Step 1: Create ProjectCardSkeleton**

```jsx
// frontend/src/components/skeletons/ProjectCardSkeleton.jsx
import React from "react";
import { Skeleton } from "@heroui/react";

const ProjectCardSkeleton = () => (
  <div className="flex items-start gap-3 p-4 border-b border-gray-100">
    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
    <Skeleton className="w-14 h-16 rounded-lg shrink-0" />
  </div>
);

export default ProjectCardSkeleton;
```

- [ ] **Step 2: Create ProfileSkeleton**

```jsx
// frontend/src/components/skeletons/ProfileSkeleton.jsx
import React from "react";
import { Skeleton } from "@heroui/react";

const ProfileSkeleton = () => (
  <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-0">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 p-4 border-b border-gray-100">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
```

- [ ] **Step 3: Create SidebarSkeleton**

```jsx
// frontend/src/components/skeletons/SidebarSkeleton.jsx
import React from "react";
import { Skeleton } from "@heroui/react";

const SidebarSkeleton = () => (
  <aside className="space-y-4">
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <Skeleton className="h-4 w-32 rounded-lg mb-3" />
      <Skeleton className="h-3 w-full rounded-lg mb-2" />
      <Skeleton className="h-3 w-2/3 rounded-lg" />
    </div>
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <Skeleton className="h-4 w-28 rounded-lg mb-3" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
          <Skeleton className="h-3 flex-1 rounded-lg" />
        </div>
      ))}
    </div>
  </aside>
);

export default SidebarSkeleton;
```

- [ ] **Step 4: Add skeletons to ProjectPage**

In `ProjectPage.jsx`, replace the spinner loading state with:

```jsx
import ProjectCardSkeleton from "../components/skeletons/ProjectCardSkeleton";

// Replace loading state:
if (loading) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
```

(Import Skeleton from @heroui/react)

- [ ] **Step 5: Add skeletons to ProfilePage**

Replace loading spinner with `<ProfileSkeleton />`.

- [ ] **Step 6: Add skeleton to RightSidebar**

Replace `if (!stats) return null;` with:

```jsx
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

if (!stats) return <SidebarSkeleton />;
```

- [ ] **Step 7: Verify build**

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/skeletons/ frontend/src/pages/ProjectPage.jsx frontend/src/pages/ProfilePage.jsx frontend/src/components/RightSidebar.jsx
git commit -m "feat: add loading skeletons for ProjectPage, ProfilePage, and RightSidebar"
```

---

## Phase 4: UX Improvements

### Task 8: RightSidebar Optimization

**Files:**
- Modify: `frontend/src/components/RightSidebar.jsx`

- [ ] **Step 1: Reduce polling interval from 10s to 60s**

```jsx
// Change:
const interval = setInterval(load, 10000);
// To:
const interval = setInterval(load, 60000);
```

- [ ] **Step 2: Add avatar error handling**

```jsx
// Replace <img src={u.avatar_url} .../> with:
<img
  src={u.avatar_url}
  alt={u.name}
  className="w-6 h-6 rounded-full ring-1 ring-white object-cover"
  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
/>
<div className="w-6 h-6 rounded-full bg-purple-100 items-center justify-center text-[8px] font-bold text-purple-600 ring-1 ring-white" style={{ display: 'none' }}>
  {u.name?.charAt(0)}
</div>
```

- [ ] **Step 3: Add skeleton loading state instead of null**

Already done in Task 7.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/RightSidebar.jsx
git commit -m "fix: reduce RightSidebar polling to 60s, add avatar error handling"
```

---

### Task 9: Admin Confirmation Dialogs

**Files:**
- Modify: `frontend/src/pages/AdminPage.jsx`

- [ ] **Step 1: Add confirmation to admin toggle**

Replace `handleToggleAdmin`:

```jsx
const handleToggleAdmin = async (userId, userName, currentlyAdmin) => {
  const action = currentlyAdmin ? "remove admin from" : "make admin";
  if (!window.confirm(`Are you sure you want to ${action} ${userName}?`)) return;
  try {
    await api.put(`/admin/users/${userId}/toggle-admin`);
    toast.success(`Admin status updated for ${userName}`);
    loadTab("users");
  } catch (err) { toast.error("Failed to update admin status."); }
};
```

Update the button onClick to pass the extra params:

```jsx
onClick={() => handleToggleAdmin(u.id, u.name, u.is_admin)}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/AdminPage.jsx
git commit -m "feat: add confirmation dialog for admin toggle action"
```

---

### Task 10: CommentModal Error vs Empty State

**Files:**
- Modify: `frontend/src/components/CommentModal.jsx`

- [ ] **Step 1: Distinguish error from empty state**

```jsx
const [error, setError] = useState(false);

useEffect(() => {
  if (isOpen) {
    setError(false);
    api.get(`/projects/${projectId}/comments`)
      .then(res => setComments(res.data || []))
      .catch(() => { setError(true); setComments([]); });
  }
}, [isOpen, projectId]);

// In render, replace the single empty state:
{comments.length === 0 ? (
  error ? (
    <p className="text-xs text-red-400 text-center py-8">Failed to load comments. Please try again.</p>
  ) : (
    <p className="text-xs text-gray-400 text-center py-8">No comments yet. Be the first!</p>
  )
) : (
  // ...existing comment rendering...
)}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/CommentModal.jsx
git commit -m "feat: distinguish error from empty state in CommentModal"
```

---

### Task 11: Login Prompt for Unauthenticated Vote/Bookmark

**Files:**
- Modify: `frontend/src/components/ProjectCard.jsx`

- [ ] **Step 1: Add login prompt on vote/bookmark click when not authenticated**

```jsx
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
// Add state for auth modal:
const [showAuthModal, setShowAuthModal] = useState(false);

// In handleUpvote and handleBookmark, replace `if (!user) return;` with:
if (!user) {
  setShowAuthModal(true);
  return;
}

// Add at bottom before closing </div>:
<AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="login" />
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ProjectCard.jsx
git commit -m "feat: show login modal when unauthenticated users try to vote or bookmark"
```

---

### Task 12: Fix CommentModal to Use AuthContext

**Files:**
- Modify: `frontend/src/components/CommentModal.jsx`

- [ ] **Step 1: Replace localStorage with AuthContext**

```jsx
import { useAuth } from "../context/AuthContext";

// Replace:
const token = localStorage.getItem("token");
// With:
const { token } = useAuth();
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/CommentModal.jsx
git commit -m "fix: CommentModal uses AuthContext instead of localStorage for auth"
```

---

## Phase 5: Backend Hardening

### Task 13: Rate Limiting on Auth Endpoints

**Files:**
- Create: `backend/src/main/java/com/innovationlab/config/RateLimitFilter.java`
- Modify: `backend/src/main/java/com/innovationlab/config/SecurityConfig.java`

- [ ] **Step 1: Create in-memory rate limit filter**

```java
// backend/src/main/java/com/innovationlab/config/RateLimitFilter.java
package com.innovationlab.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 10; // per minute
    private static final long WINDOW_MS = 60_000;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            String key = getClientIP(request) + ":" + path;
            long now = System.currentTimeMillis();

            AtomicInteger count = requestCounts.computeIfAbsent(key, k -> new AtomicInteger(0));
            if (count.incrementAndGet() > MAX_REQUESTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"detail\":\"Too many requests. Please try again later.\"}");
                return;
            }

            // Reset after window
            requestCounts.entrySet().removeIf(e ->
                now - Long.parseLong(e.getKey().split(":")[2]) > WINDOW_MS);
        }

        chain.doFilter(req, res);
    }

    private String getClientIP(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        return xff != null ? xff.split(",")[0].trim() : request.getRemoteAddr();
    }
}
```

- [ ] **Step 2: Register filter in SecurityConfig**

```java
// Add field:
private final RateLimitFilter rateLimitFilter;

// Add before jwtFilter in filterChain:
.addFilterBefore(rateLimitFilter, JwtAuthenticationFilter.class)
```

- [ ] **Step 3: Compile**

Run: `cd backend && mvn compile -q`

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/innovationlab/config/RateLimitFilter.java backend/src/main/java/com/innovationlab/config/SecurityConfig.java
git commit -m "feat: add rate limiting (10 req/min) on login and register endpoints"
```

---

### Task 14: Input Sanitization

**Files:**
- Create: `backend/src/main/java/com/innovationlab/util/SanitizeUtil.java`
- Modify: `backend/src/main/java/com/innovationlab/service/ProjectService.java`
- Modify: `backend/src/main/java/com/innovationlab/service/AuthService.java`

- [ ] **Step 1: Create SanitizeUtil**

```java
// backend/src/main/java/com/innovationlab/util/SanitizeUtil.java
package com.innovationlab.util;

public class SanitizeUtil {
    public static String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "")  // strip HTML tags
                    .replaceAll("&[a-zA-Z]+;", "")  // strip HTML entities
                    .replaceAll("javascript:", "")  // strip JS protocol
                    .trim();
    }
}
```

- [ ] **Step 2: Apply sanitization in ProjectService**

In `createProject` and `updateProject`, sanitize string fields:

```java
import com.innovationlab.util.SanitizeUtil;

// In createProject:
project.setName(SanitizeUtil.sanitize(req.getName()));
project.setTagline(SanitizeUtil.sanitize(req.getTagline()));
project.setDescription(SanitizeUtil.sanitize(req.getDescription()));

// Same in updateProject for each field
```

- [ ] **Step 3: Apply sanitization in AuthService**

```java
// In register:
user.setName(SanitizeUtil.sanitize(req.getName()));
if (req.getInstitution() != null) user.setInstitution(SanitizeUtil.sanitize(req.getInstitution()));

// In updateProfile:
if (req.getName() != null && !req.getName().isBlank()) user.setName(SanitizeUtil.sanitize(req.getName()));
if (req.getInstitution() != null) user.setInstitution(SanitizeUtil.sanitize(req.getInstitution()));
```

- [ ] **Step 4: Compile**

Run: `cd backend && mvn compile -q`

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/innovationlab/util/SanitizeUtil.java backend/src/main/java/com/innovationlab/service/ProjectService.java backend/src/main/java/com/innovationlab/service/AuthService.java
git commit -m "feat: add input sanitization for HTML/JS injection on user inputs"
```

---

### Task 15: Password Complexity Validation

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/model/dto/RegisterRequest.java`
- Modify: `backend/src/main/java/com/innovationlab/service/AuthService.java`

- [ ] **Step 1: Add password validation to RegisterRequest**

```java
// In RegisterRequest.java, add validation annotation:
import jakarta.validation.constraints.Size;

@NotBlank
@Size(min = 8, message = "Password must be at least 8 characters")
private String password;
```

- [ ] **Step 2: Add password complexity check in AuthService**

```java
// In register(), before creating user:
String password = req.getPassword();
if (password.length() < 8) {
    throw new RuntimeException("Password must be at least 8 characters");
}
if (!password.matches(".*[A-Z].*")) {
    throw new RuntimeException("Password must contain at least one uppercase letter");
}
if (!password.matches(".*[0-9].*")) {
    throw new RuntimeException("Password must contain at least one number");
}
```

- [ ] **Step 3: Update AuthModal placeholder**

In `AuthModal.jsx`, change placeholder from "Min 6 characters" to "Min 8 chars, 1 uppercase, 1 number".

- [ ] **Step 4: Compile**

Run: `cd backend && mvn compile -q`

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/innovationlab/model/dto/RegisterRequest.java backend/src/main/java/com/innovationlab/service/AuthService.java frontend/src/components/AuthModal.jsx
git commit -m "feat: enforce password complexity (8+ chars, uppercase, number)"
```

---

### Task 16: Admin Delete User Endpoint

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/controller/AdminController.java`
- Modify: `frontend/src/pages/AdminPage.jsx`

- [ ] **Step 1: Add delete user endpoint**

```java
// In AdminController.java:
@DeleteMapping("/users/{id}")
public ResponseEntity<Map<String, String>> deleteUser(
        @RequestHeader(value = "Authorization", required = false) String auth,
        @PathVariable String id) {
    requireAdmin(auth);
    User user = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    // Delete user's projects and related data
    List<Project> userProjects = projectRepo.findByUserId(id, Pageable.unpaged()).getContent();
    for (Project p : userProjects) {
        voteRepo.deleteByProjectId(p.getId());
        commentRepo.deleteByProjectId(p.getId());
        bookmarkRepo.deleteByProjectId(p.getId());
        projectRepo.delete(p);
    }
    userRepo.delete(user);
    Map<String, String> result = new HashMap<>();
    result.put("message", "User deleted");
    return ResponseEntity.ok(result);
}
```

- [ ] **Step 2: Add delete button to admin users tab**

In `AdminPage.jsx` users tab, add a delete button column and handler:

```jsx
const handleDeleteUser = async (userId, userName) => {
  if (!window.confirm(`Delete user "${userName}" and all their projects?`)) return;
  try {
    await api.delete(`/admin/users/${userId}`);
    toast.success(`User ${userName} deleted`);
    loadTab("users");
  } catch (err) { toast.error("Failed to delete user."); }
};
```

- [ ] **Step 3: Compile**

Run: `cd backend && mvn compile -q`

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/innovationlab/controller/AdminController.java frontend/src/pages/AdminPage.jsx
git commit -m "feat: admin can delete users with cascading project cleanup"
```

---

### Task 17: Profile Update Endpoint Enhancement

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/model/dto/ProfileUpdateRequest.java`
- Modify: `backend/src/main/java/com/innovationlab/service/AuthService.java`
- Modify: `frontend/src/pages/ProfilePage.jsx`

- [ ] **Step 1: Add all fields to ProfileUpdateRequest**

```java
public class ProfileUpdateRequest {
    private String name;
    private String institution;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String hobbies;
    // Add getters and setters for all
}
```

- [ ] **Step 2: Update AuthService.updateProfile**

```java
public UserResponse updateProfile(String userId, ProfileUpdateRequest req) {
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    if (req.getName() != null && !req.getName().isBlank()) user.setName(SanitizeUtil.sanitize(req.getName()));
    if (req.getInstitution() != null) user.setInstitution(SanitizeUtil.sanitize(req.getInstitution()));
    if (req.getBio() != null) user.setBio(SanitizeUtil.sanitize(req.getBio()));
    if (req.getGithubUrl() != null) user.setGithubUrl(req.getGithubUrl());
    if (req.getLinkedinUrl() != null) user.setLinkedinUrl(req.getLinkedinUrl());
    if (req.getWebsiteUrl() != null) user.setWebsiteUrl(req.getWebsiteUrl());
    if (req.getHobbies() != null) user.setHobbies(SanitizeUtil.sanitize(req.getHobbies()));
    userRepo.save(user);
    return toResponse(user);
}
```

Also update `toResponse` to include all fields:

```java
private UserResponse toResponse(User u) {
    UserResponse r = new UserResponse(u.getId(), u.getName(), u.getEmail(),
        u.getInstitution() != null ? u.getInstitution() : "",
        u.isAdmin(), u.getCreatedAt());
    r.setBio(u.getBio() != null ? u.getBio() : "");
    r.setAvatarUrl(u.getAvatarUrl());
    r.setGithubUrl(u.getGithubUrl());
    r.setLinkedinUrl(u.getLinkedinUrl());
    r.setWebsiteUrl(u.getWebsiteUrl());
    r.setHobbies(u.getHobbies());
    return r;
}
```

- [ ] **Step 3: Update ProfilePage edit form**

Add social link fields to the edit form in ProfilePage.jsx:

```jsx
// Add to editForm state:
{ name: "", institution: "", bio: "", github_url: "", linkedin_url: "", website_url: "", hobbies: "" }

// Add form fields for github_url, linkedin_url, website_url, hobbies in the edit section
// Update handleSave to send all fields
```

- [ ] **Step 4: Update ProfilePage handleSave**

```jsx
const handleSave = async () => {
  setSaving(true);
  try {
    await api.put("/auth/me", editForm);
    setEditing(false);
    setProfileUser((prev) => prev ? { ...prev, ...editForm } : prev);
    toast.success("Profile updated!");
  } catch (err) { toast.error("Failed to update profile."); }
  finally { setSaving(false); }
};
```

- [ ] **Step 5: Compile**

Run: `cd backend && mvn compile -q`

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/innovationlab/model/dto/ProfileUpdateRequest.java backend/src/main/java/com/innovationlab/service/AuthService.java frontend/src/pages/ProfilePage.jsx
git commit -m "feat: full profile update (bio, social links, hobbies) via /auth/me"
```

---

## Phase 6: SEO + Performance

### Task 18: Dynamic Page Titles

**Files:**
- Modify: `frontend/src/pages/ProjectPage.jsx`
- Modify: `frontend/src/pages/ProfilePage.jsx`
- Modify: `frontend/src/pages/CategoryPage.jsx`
- Modify: `frontend/src/pages/BlogPage.jsx`
- Modify: `frontend/src/pages/LeaderboardPage.jsx`

- [ ] **Step 1: Add document.title to each page**

In each page's useEffect after data loads:

```jsx
// ProjectPage:
useEffect(() => {
  if (project) document.title = `${project.name} | Innovation Lab`;
}, [project]);

// ProfilePage:
useEffect(() => {
  if (displayUser) document.title = `${displayUser.name} | Innovation Lab`;
}, [displayUser]);

// CategoryPage:
useEffect(() => {
  if (slug) document.title = `${slug} Projects | Innovation Lab`;
}, [slug]);

// LeaderboardPage:
document.title = "Leaderboard | Innovation Lab";

// BlogPage:
document.title = "Blog | Innovation Lab";
```

- [ ] **Step 2: Add meta description in index.html**

Read `frontend/public/index.html` and add:

```html
<meta name="description" content="South Africa's premier innovation competition. Showcase your project, get community votes, and win R500K in prizes." />
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/ frontend/public/index.html
git commit -m "feat: dynamic page titles and meta description for SEO"
```

---

### Task 19: Remove Duplicate CSS Animations

**Files:**
- Modify: `frontend/src/App.css`

- [ ] **Step 1: Remove duplicate keyframes from App.css**

Delete the duplicate `@keyframes fadeInUp`, `fadeIn`, `slideInLeft`, `slideInRight`, `scaleIn` blocks from App.css (lines 57-105). Keep only the ones in index.css.

Keep in App.css only:
```css
/* Scrollbar styling */
/* Selection styling */
/* Header animation */
.App > div > header {
  animation: fadeIn 0.3s ease-out;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/App.css
git commit -m "refactor: remove duplicate animation keyframes from App.css"
```

---

### Task 20: Image Error Handling on ProjectCard Logos

**Files:**
- Modify: `frontend/src/components/ProjectCard.jsx`

- [ ] **Step 1: Add onError fallback for logo images**

```jsx
// Replace the logo image:
{logoImage ? (
  <img
    src={logoImage}
    alt={project.name}
    className="w-full h-full object-cover"
    onError={(e) => { e.target.style.display = 'none'; }}
  />
) : (
  logoInitial
)}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ProjectCard.jsx
git commit -m "feat: add image error handling for project logo thumbnails"
```

---

## Execution Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-3 | Error boundary + toast notifications |
| 2 | 4-6 | Search + pagination |
| 3 | 7 | Loading skeletons |
| 4 | 8-12 | UX improvements (sidebar, admin, comments, auth) |
| 5 | 13-17 | Backend hardening (rate limit, sanitization, validation, admin, profile) |
| 6 | 18-20 | SEO + performance |

**Total: 20 tasks, ~100 steps**

**Backend compilation check:** Run `cd backend && mvn compile -q` after each backend task.
**Frontend build check:** Run `cd frontend && npx react-scripts build 2>&1 | tail -5` after each frontend task.
