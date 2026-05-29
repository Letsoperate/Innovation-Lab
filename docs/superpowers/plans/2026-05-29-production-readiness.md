# Production Readiness Plan — InnovationLab

## Overview
Comprehensive fixes to turn the Innovation Lab platform into a production-ready product.
Covers: security hardening, bug fixes, performance optimization, UX polish, missing features.

---

## Phase 1: Backend — Security & Correctness

### 1.1 Fix SecurityConfig — Missing Permit Rules
**File:** `backend/src/main/java/com/innovationlab/config/SecurityConfig.java`
**Problem:** Individual project pages (`/api/projects/{id}`) and user profiles (`/api/users/**`) are not in the permit list. Unauthenticated users cannot view project details or public profiles.
**Fix:** Add permit rules:
```java
.requestMatchers(HttpMethod.GET, "/api/projects/{id}").permitAll()
.requestMatchers(HttpMethod.GET, "/api/users/*/profile").permitAll()
.requestMatchers(HttpMethod.GET, "/api/users/*/followers").permitAll()
.requestMatchers(HttpMethod.GET, "/api/users/*/following").permitAll()
.requestMatchers(HttpMethod.GET, "/api/users/*/bookmarks").permitAll()
```

### 1.2 Fix StatsController/AdminController — Missing Logo Image
**Files:** `StatsController.java`, `AdminController.java`
**Problem:** `toResponse()` method doesn't set `logoImage` — logo images lost in all response DTOs.
**Fix:** Add `r.setLogoImage(p.getLogoImage())` to both `toResponse()` methods.

### 1.3 Fix Duplicate Profile Endpoints
**Files:** `SocialController.java`, `AuthController.java`
**Problem:** `SocialController.updateProfile()` at `PUT /api/auth/profile` duplicates `AuthController.updateProfile()` at `PUT /api/auth/me`. Routes may conflict.
**Fix:** Remove the duplicate endpoint from `SocialController`. Keep `AuthController`'s `/api/auth/me` as the canonical profile update endpoint.

### 1.4 Fix GlobalExceptionHandler
**File:** `backend/src/main/java/com/innovationlab/config/GlobalExceptionHandler.java`
**Problem:** Returns 500 for all unknown errors.
**Fix:** Add specific handlers for common exceptions (IllegalArgumentException → 400, EntityNotFoundException → 404, etc.).

### 1.5 Fix Admin Endpoint Security
**File:** `SecurityConfig.java`
**Problem:** Admin endpoints require authentication but not role-based authorization. Any authenticated user can access admin endpoints.
**Fix:** Add role-based authorization for admin endpoints:
```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
```

### 1.6 Backend Performance — StatsController
**File:** `StatsController.java`
**Problem:** Loads ALL projects into memory for stats/leaderboard/search — O(n) performance issue.
**Fix:** Use SQL aggregation queries instead of loading all projects. Add proper indexes.

---

## Phase 2: Frontend — Critical Bug Fixes

### 2.1 Fix ProfilePage — Wrong Name Display
**File:** `frontend/src/pages/ProfilePage.js` (line ~170)
**Problem:** Always shows `user.name` even when viewing other profiles (should use `displayUser.name`).
**Fix:** Change `user.name` to `displayUser.name`.

### 2.2 Fix AdminPage — Field Name Mismatch
**File:** `frontend/src/pages/AdminPage.js` (line ~229)
**Problem:** `top_categories` display uses `c.category` but backend returns `c.name`.
**Fix:** Change `c.category` to `c.name`.

### 2.3 Add 404/Catch-All Route
**File:** `frontend/src/App.js`
**Problem:** No catch-all route for undefined paths.
**Fix:** Add `NotFoundPage` component and catch-all route.

### 2.4 Fix CommentModal — No Login Prompt
**File:** `frontend/src/components/CommentModal.js`
**Problem:** Shows comment form when token exists but no "login to comment" prompt for unauthenticated users.
**Fix:** Show login prompt when no token.

### 2.5 Fix ProjectPage — Load via ID Endpoint
**File:** `frontend/src/pages/ProjectPage.js`
**Problem:** Loads project via search query instead of direct ID endpoint — fragile and slow.
**Fix:** Use the `/api/projects/{id}` endpoint directly with axios.

---

## Phase 3: Frontend — UX Polish

### 3.1 Fix HeroSection Search — Make Functional
**File:** `frontend/src/components/HeroSection.js`
**Problem:** Search input is non-functional — local state only, no navigation.
**Fix:** Add navigation to search results page on submit.

### 3.2 Fix ProfilePage Save — Better UX
**File:** `frontend/src/pages/ProfilePage.js`
**Problem:** `handleSave()` uses `window.location.reload()` — terrible UX.
**Fix:** Update auth context and local state instead of reloading.

### 3.3 Fix Navbar Timeline — Dynamic Phase
**File:** `frontend/src/components/Navbar.js`
**Problem:** Timeline indicator hardcoded as "Registration: Open Now" — doesn't reflect actual phase.
**Fix:** Add dynamic phase detection based on competition dates or API data.

### 3.4 Add Loading States for Follow/Unfollow
**File:** `frontend/src/pages/ProfilePage.js`
**Problem:** No loading/error states for follow/unfollow button.
**Fix:** Add loading spinner and error handling.

### 3.5 Fix Footer Dead Links
**File:** `frontend/src/components/Footer.js`
**Problem:** Many links point to `/` that don't go anywhere useful.
**Fix:** Update links to actual pages or remove dead links.

### 3.6 Add User-Facing Error Messages
**Files:** Multiple frontend files
**Problem:** Multiple `console.error` calls without user-facing error messages.
**Fix:** Add toast notifications or inline error messages.

### 3.7 Fix RightSidebar Avatar Images
**File:** `frontend/src/components/RightSidebar.js`
**Problem:** Avatar images lack error handling — broken images possible.
**Fix:** Add onError handler with fallback avatar.

---

## Phase 4: Performance & Code Quality

### 4.1 Remove Duplicate Animation Keyframes
**Files:** `App.css`, `index.css`
**Problem:** Duplicate animation keyframes (fadeInUp, slideInLeft/Right, scaleIn) in both files.
**Fix:** Remove duplicates from one file, keep in one place.

### 4.2 Add React.memo to Components
**Files:** Multiple frontend components
**Problem:** No memoization — unnecessary re-renders.
**Fix:** Add `React.memo` to pure components.

### 4.3 RightSidebar Polling Interval
**File:** `frontend/src/components/RightSidebar.js`
**Problem:** Polls every 10 seconds — expensive for production.
**Fix:** Increase interval to 60 seconds or use SSE.

---

## Execution Order
1. Backend security fixes (1.1, 1.5) — CRITICAL
2. Backend bug fixes (1.2, 1.3, 1.4)
3. Frontend critical bugs (2.1-2.5)
4. Frontend UX polish (3.1-3.7)
5. Performance & code quality (4.1-4.3)
