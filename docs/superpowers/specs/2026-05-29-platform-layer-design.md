# Platform Layer — Design Spec

## Summary

Four features that transform Innovation Lab from a functional MVP into a sticky, production-ready platform: GitHub OAuth + repo import, dark mode, notification system, and following feed. All four ship together as one coherent release.

---

## 1. GitHub OAuth + Project Import

Full design already specified in `docs/superpowers/specs/2026-05-29-github-oauth-project-import-design.md`. This spec references that design and adds minor refinements.

### 1a. Backend

**New files:**
- `backend/src/main/java/com/innovationlab/service/GitHubService.java`
- `backend/src/main/java/com/innovationlab/controller/GitHubController.java`

**Modified files:**
- `User.java` — add `githubId` field (nullable, unique)
- `UserRepository.java` — add `findByGithubId(String)`
- `SecurityConfig.java` — permit `/api/auth/github/callback`
- `application.properties` — add `github.client.id` and `github.client.secret`

**Endpoint:** `POST /api/auth/github/callback` — accepts `{ code }`, exchanges for token, finds/creates user, returns JWT + UserResponse.

### 1b. Frontend

**Modified:**
- `AuthModal.jsx` — "Continue with GitHub" button between form and footer
- `AuthContext.jsx` — detect `?code=` param, call `/auth/github/callback`, store JWT
- `SubmitPage.jsx` — "Import from GitHub" button (visible when githubToken present)

**New:**
- `GitHubRepoModal.jsx` — fetches repos via GitHub API with access token, search/filter, select button

### 1c. Refinement from original spec
- The callback response field is `token` not `access_token` (matches `AuthResponse` DTO)
- AuthContext callback handler uses `res.data.token` and `res.data.user`
- Store GitHub access token in `AuthContext.githubToken` state (memory only, not localStorage)

---

## 2. Dark Mode

### 2a. Architecture
- `ThemeContext` with `theme` state: `"light" | "dark" | "system"`
- Persist to `localStorage("theme")`
- On mount, resolve `system` → `prefers-color-scheme` media query
- Toggle `<html>` class: `document.documentElement.classList.toggle("dark", isDark)`
- Listen to `prefers-color-scheme` change events when theme is `"system"`

### 2b. Files

**New:**
- `frontend/src/context/ThemeContext.jsx`

**Modified:**
- `frontend/src/App.js` — wrap with `<ThemeProvider>`
- `frontend/src/components/Navbar.jsx` — add theme toggle button (Sun/Moon from Lucide)

### 2c. Per-Page Dark Variants
Tailwind `dark:` prefix handles most cases. Key patterns:
- Pages: add `dark:bg-gray-900 dark:text-gray-100` to root containers
- Cards: add `dark:bg-gray-800 dark:border-gray-700` to bordered containers
- Text: add `dark:text-gray-300` for body, `dark:text-gray-100` for headings
- Inputs: add `dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100`

### 2d. Migration Strategy
One pass through each page component adding dark variants. Use consistent semantic classes:
- Page bg: `bg-gray-50 dark:bg-gray-950`
- Card bg: `bg-white dark:bg-gray-900`
- Card border: `border-gray-200 dark:border-gray-800`
- Body text: `text-gray-700 dark:text-gray-300`
- Heading text: `text-gray-900 dark:text-gray-100` (or `text-purple-800 dark:text-purple-300` for brand)

---

## 3. Notification System

### 3a. Backend

**New entity — `Notification.java`:**
```
id: UUID
userId: UUID (FK → users)
type: String (FOLLOW, VOTE, COMMENT, BOOKMARK)
message: String
link: String (URL to navigate on click)
read: Boolean (default false)
createdAt: Instant
```

**New repository — `NotificationRepository.java`:**
- `findByUserIdOrderByCreatedAtDesc(String userId, Pageable)`
- `countByUserIdAndReadFalse(String userId)`

**New service — `NotificationService.java`:**
- `createNotification(userId, type, message, link)` — called from other services
- `getNotifications(userId, page, limit)` — paginated
- `markRead(notificationId, userId)` — mark single as read
- `markAllRead(userId)` — mark all as read
- `getUnreadCount(userId)` — for the bell badge

**New controller — `NotificationController.java`:**
- `GET /api/notifications?page=&limit=` (authenticated)
- `GET /api/notifications/unread-count` (authenticated)
- `PUT /api/notifications/{id}/read` (authenticated)
- `PUT /api/notifications/read-all` (authenticated)

**Trigger points** (modify existing services):
- `SocialService.followUser()` — notify followed user: "X started following you"
- `ProjectService.toggleVote()` — notify project owner: "X voted on ProjectName"
- `CommentService` — notify project owner: "X commented on ProjectName"
- `ProjectService.toggleBookmark()` — notify project owner: "X saved ProjectName"

**Security config:** add `/api/notifications/**` to authenticated (not admin).

### 3b. Frontend

**New:**
- `frontend/src/components/NotificationBell.jsx` — bell icon in Navbar with unread count badge, click opens dropdown
- Notification dropdown: lists recent notifications, "Mark all read" button, empty state

**Modified:**
- `frontend/src/components/Navbar.jsx` — integrate NotificationBell next to profile icon
- `frontend/src/App.js` — route for `/notifications` (full page view optional, dropdown is primary)

### 3c. Polling
Poll `GET /api/notifications/unread-count` every 30 seconds (only when logged in). Reuse pattern from RightSidebar.

---

## 4. Following Feed

### 4a. Backend

**Modify `ProjectController.java`** — add support for `tab=following`:
- When `tab=following`, query projects where `userId` is in the set of users the current user follows
- Query: `SELECT p FROM Project p WHERE p.userId IN (SELECT f.followedId FROM Follow f WHERE f.followerId = :userId) ORDER BY p.createdAt DESC`
- Respect existing pagination (`page`, `limit` params)
- Requires authentication

**Modify `ProjectRepository.java`:**
- Add `findProjectsFromFollowedUsers(userId, Pageable)` using `@Query`

### 4b. Frontend

**Modified:**
- `frontend/src/pages/HomePage.jsx` — add "Following" tab alongside existing Top/Live/Recent/Updated tabs
- Only visible when user is logged in
- Reuses `ProjectCard`, `Pagination`, existing skeleton

### 4c. Tab Order (HomePage)
Top | Following | Live | Recent | Updated
- Following tab positioned second for prominence
- Hidden if not authenticated (or shows login prompt)

---

## Implementation Order

1. **Dark Mode** — foundation, no backend dependency, done in one pass
2. **GitHub OAuth Backend** — User entity, GitHubService, GitHubController, SecurityConfig
3. **GitHub OAuth Frontend** — AuthModal, AuthContext, GitHubRepoModal, SubmitPage
4. **Notification Backend** — entity, repo, service, controller, trigger points
5. **Notification Frontend** — NotificationBell, Navbar integration
6. **Following Feed Backend** — ProjectController tab support, repository query
7. **Following Feed Frontend** — HomePage tab addition

Backend compiles after every backend task. Frontend builds after every frontend task.

---

## Verification
- Backend: `cd backend && mvn compile -q`
- Frontend: `cd frontend && npm run build 2>&1 | tail -5`
- GitHub OAuth: manual test with GitHub OAuth app credentials
- Dark mode: toggle in Navbar, verify persistence on reload
- Notifications: follow user → check notification appears
- Following feed: follow user → their projects appear in Following tab
