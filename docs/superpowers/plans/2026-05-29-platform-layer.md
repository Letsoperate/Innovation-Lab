# Platform Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 4 production features: GitHub OAuth + project import, dark mode, notification system, and following feed.

**Architecture:** Dark mode is frontend-only (ThemeContext + Tailwind `dark:` variants). GitHub OAuth adds new backend service/controller + frontend modal/button/callback. Notifications add a new backend entity/service/controller with trigger points in existing services + a Navbar bell component. Following feed extends the existing ProjectController with a `tab=following` query + a new HomePage tab.

**Tech Stack:** Spring Boot 3.4, Java 21, React 19, Tailwind CSS, Lucide icons, HeroUI

---

## File Structure Overview

### Backend — New
- `backend/src/main/java/com/innovationlab/model/entity/Notification.java`
- `backend/src/main/java/com/innovationlab/repository/NotificationRepository.java`
- `backend/src/main/java/com/innovationlab/service/NotificationService.java`
- `backend/src/main/java/com/innovationlab/controller/NotificationController.java`
- `backend/src/main/java/com/innovationlab/service/GitHubService.java`
- `backend/src/main/java/com/innovationlab/controller/GitHubController.java`

### Backend — Modify
- `backend/src/main/java/com/innovationlab/model/entity/User.java` — add `githubId`
- `backend/src/main/java/com/innovationlab/repository/UserRepository.java` — add `findByGithubId`
- `backend/src/main/java/com/innovationlab/repository/ProjectRepository.java` — add following feed query
- `backend/src/main/java/com/innovationlab/controller/ProjectController.java` — tab=following support
- `backend/src/main/java/com/innovationlab/service/ProjectService.java` — trigger notifications on vote/bookmark
- `backend/src/main/java/com/innovationlab/service/SocialService.java` — trigger notification on follow
- `backend/src/main/java/com/innovationlab/config/SecurityConfig.java` — permit GitHub callback + notifications
- `backend/src/main/resources/application.properties` — GitHub OAuth config

### Frontend — New
- `frontend/src/context/ThemeContext.jsx`
- `frontend/src/components/GitHubRepoModal.jsx`
- `frontend/src/components/NotificationBell.jsx`

### Frontend — Modify
- `frontend/src/App.js` — ThemeProvider, notification route
- `frontend/src/components/Navbar.jsx` — theme toggle + NotificationBell
- `frontend/src/context/AuthContext.jsx` — GitHub callback handler
- `frontend/src/components/AuthModal.jsx` — GitHub login button
- `frontend/src/pages/SubmitPage.jsx` — import from GitHub button
- `frontend/src/pages/HomePage.jsx` — Following tab
- `frontend/src/pages/ProjectPage.jsx` — dark variants
- `frontend/src/pages/ProfilePage.jsx` — dark variants
- `frontend/src/pages/SearchPage.jsx` — dark variants
- `frontend/src/pages/CategoryPage.jsx` — dark variants
- `frontend/src/pages/LeaderboardPage.jsx` — dark variants
- `frontend/src/pages/BlogPage.jsx` — dark variants
- `frontend/src/pages/HallOfFamePage.jsx` — dark variants
- `frontend/src/pages/HowItWorksPage.jsx` — dark variants
- `frontend/src/pages/NotFoundPage.jsx` — dark variants
- `frontend/src/components/ProjectCard.jsx` — dark variants
- `frontend/src/components/CommentModal.jsx` — dark variants
- `frontend/src/components/Footer.jsx` — dark variants
- `frontend/src/components/RightSidebar.jsx` — dark variants

---

## Phase 1: Dark Mode

### Task 1: ThemeContext

**Files:**
- Create: `frontend/src/context/ThemeContext.jsx`

- [ ] **Step 1: Create ThemeContext**

```jsx
// frontend/src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  const [resolved, setResolved] = useState(false);

  const apply = useCallback((t) => {
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    setResolved(isDark);
  }, []);

  useEffect(() => {
    apply(theme);
    localStorage.setItem("theme", theme);
  }, [theme, apply]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => apply("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, apply]);

  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");
  const setSystem = () => setTheme("system");

  return (
    <ThemeContext.Provider value={{ theme, resolved, setLight, setDark, setSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add frontend/src/context/ThemeContext.jsx
git commit -m "feat: add ThemeContext for light/dark/system mode"
```

---

### Task 2: Wrap App with ThemeProvider + Add Toggle to Navbar

**Files:**
- Modify: `frontend/src/App.js`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Add ThemeProvider to App.js**

In `App.js`, add import:
```jsx
import { ThemeProvider } from "./context/ThemeContext";
```

Wrap the component tree (keeping AuthProvider as outermost):
```jsx
<AuthProvider>
  <ThemeProvider>
    <ToastProvider>
      <ErrorBoundary>
        <BrowserRouter>
          {/* ... */}
        </BrowserRouter>
      </ErrorBoundary>
    </ToastProvider>
  </ThemeProvider>
</AuthProvider>
```

- [ ] **Step 2: Add theme toggle to Navbar**

In `Navbar.jsx`, add imports:
```jsx
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
```

Add `const { resolved, setLight, setDark } = useTheme();` inside the component.

Add the toggle button next to the profile/avatar area (before the user menu button):
```jsx
<button
  onClick={() => resolved ? setLight() : setDark()}
  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
  aria-label="Toggle theme"
>
  {resolved ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
</button>
```

- [ ] **Step 3: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/App.js frontend/src/components/Navbar.jsx
git commit -m "feat: add ThemeProvider wrapper and Navbar theme toggle"
```

---

### Task 3: Apply Dark Variants to All Pages

**Files:**
- Modify: `frontend/src/pages/HomePage.jsx`
- Modify: `frontend/src/pages/ProjectPage.jsx`
- Modify: `frontend/src/pages/ProfilePage.jsx`
- Modify: `frontend/src/pages/SearchPage.jsx`
- Modify: `frontend/src/pages/CategoryPage.jsx`
- Modify: `frontend/src/pages/LeaderboardPage.jsx`
- Modify: `frontend/src/pages/BlogPage.jsx`
- Modify: `frontend/src/pages/HallOfFamePage.jsx`
- Modify: `frontend/src/pages/HowItWorksPage.jsx`
- Modify: `frontend/src/pages/SubmitPage.jsx`
- Modify: `frontend/src/pages/AdminPage.jsx`
- Modify: `frontend/src/pages/SponsorDashboard.jsx`

- [ ] **Step 1: Add dark variant classes to each page's root container**

Each page has a root `<div>` with `className`. Add these dark variants to each page's outermost container:

| Page | Add to root className |
|------|----------------------|
| HomePage | `dark:bg-gray-950` |
| ProjectPage | `dark:bg-gray-950` |
| ProfilePage | `dark:bg-gray-950` |
| SearchPage | `dark:bg-gray-950` |
| CategoryPage | `dark:bg-gray-950` |
| LeaderboardPage | `dark:bg-gray-950` |
| BlogPage | `dark:bg-gray-950` |
| HallOfFamePage | `dark:bg-gray-950` |
| HowItWorksPage | `dark:bg-gray-950` |
| SubmitPage | `dark:bg-gray-950` |
| AdminPage | `dark:bg-gray-950` |
| SponsorDashboard | `dark:bg-gray-950` |

For cards/containers with `bg-white border border-gray-200`, add `dark:bg-gray-900 dark:border-gray-800`.
For heading text with `text-purple-800`, add `dark:text-purple-300`.
For body text with `text-gray-700` or `text-gray-600`, add `dark:text-gray-300`.
For lighter text with `text-gray-500` or `text-gray-400`, add `dark:text-gray-400`.

- [ ] **Step 2: Apply dark variants to shared components**

Modify `frontend/src/components/ProjectCard.jsx` — add to the card div:
```
dark:border-gray-800 dark:hover:bg-gray-800/50 dark:bg-gray-900
```
And to text elements:
- Title: `dark:text-gray-100`
- Description: `dark:text-gray-400`
- Tags: `dark:text-gray-500`

Modify `frontend/src/components/RightSidebar.jsx` — add to sidebar sections:
```
dark:bg-gray-900 dark:border-gray-800
```
Text: `dark:text-gray-300`, headings: `dark:text-gray-100`

Modify `frontend/src/components/Footer.jsx` — add to footer:
```
dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400
```

Modify `frontend/src/components/CommentModal.jsx` — add to modal:
```
dark:bg-gray-900 dark:text-gray-100
```
Inputs: `dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100`

Modify `frontend/src/components/Navbar.jsx` — add to navbar:
```
dark:bg-gray-950/80 dark:border-gray-800 dark:text-gray-100
```

Modify `frontend/src/components/HeroSection.jsx`:
- Container: `dark:bg-gray-900`
- Text: `dark:text-gray-100`, subtitle: `dark:text-gray-400`

- [ ] **Step 3: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/ frontend/src/components/
git commit -m "feat: apply dark mode variants to all pages and components"
```

---

## Phase 2: GitHub OAuth + Project Import

### Task 4: Add githubId to User Entity

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/model/entity/User.java`
- Modify: `backend/src/main/java/com/innovationlab/repository/UserRepository.java`

- [ ] **Step 1: Add githubId field to User entity**

Read `User.java` to find the field declarations section. After the `avatarUrl` field, add:

```java
@Column(name = "github_id", unique = true)
private String githubId;
```

Add getter/setter after existing getter/setter methods:

```java
public String getGithubId() { return githubId; }
public void setGithubId(String githubId) { this.githubId = githubId; }
```

- [ ] **Step 2: Add findByGithubId to UserRepository**

In `UserRepository.java`, add:

```java
Optional<User> findByGithubId(String githubId);
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/innovationlab/model/entity/User.java backend/src/main/java/com/innovationlab/repository/UserRepository.java
git commit -m "feat: add githubId field to User entity"
```

---

### Task 5: Add GitHub OAuth Config + Security Rules

**Files:**
- Modify: `backend/src/main/resources/application.properties`
- Modify: `backend/src/main/java/com/innovationlab/config/SecurityConfig.java`

- [ ] **Step 1: Add GitHub OAuth properties**

Read `application.properties` and append:

```properties
# GitHub OAuth
github.client.id=${GITHUB_CLIENT_ID:}
github.client.secret=${GITHUB_CLIENT_SECRET:}
```

- [ ] **Step 2: Permit GitHub callback in SecurityConfig**

Read `SecurityConfig.java`. Find the `permitAll` chain for auth endpoints. Add `/api/auth/github/callback` to the list:

```java
.requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/github/callback").permitAll()
```

Also add notification endpoints to authenticated (not admin) — find the `authenticated()` default and add before it:

```java
.requestMatchers("/api/notifications/**").authenticated()
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/resources/application.properties backend/src/main/java/com/innovationlab/config/SecurityConfig.java
git commit -m "feat: add GitHub OAuth config and security rules"
```

---

### Task 6: Create GitHubService

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/GitHubService.java`

- [ ] **Step 1: Create GitHubService.java**

```java
package com.innovationlab.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GitHubService {

    @Value("${github.client.id:}")
    private String clientId;

    @Value("${github.client.secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public String exchangeCodeForToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        Map<String, String> body = Map.of(
            "client_id", clientId,
            "client_secret", clientSecret,
            "code", code
        );

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://github.com/login/oauth/access_token", request, Map.class
        );

        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            return (String) response.getBody().get("access_token");
        }
        throw new RuntimeException("Failed to exchange GitHub code for token");
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/json");
        headers.set("User-Agent", "InnovationLab");

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            "https://api.github.com/user", HttpMethod.GET, request, Map.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to get GitHub user info");
    }
}
```

- [ ] **Step 2: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/GitHubService.java
git commit -m "feat: add GitHubService for OAuth code exchange and user info"
```

---

### Task 7: Create GitHubController

**Files:**
- Create: `backend/src/main/java/com/innovationlab/controller/GitHubController.java`

- [ ] **Step 1: Create GitHubController.java**

```java
package com.innovationlab.controller;

import com.innovationlab.model.dto.AuthResponse;
import com.innovationlab.model.dto.UserResponse;
import com.innovationlab.model.entity.User;
import com.innovationlab.repository.UserRepository;
import com.innovationlab.security.JwtProvider;
import com.innovationlab.service.GitHubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GitHubController {

    private final GitHubService gitHubService;
    private final UserRepository userRepo;
    private final JwtProvider jwtProvider;

    public GitHubController(GitHubService gitHubService, UserRepository userRepo, JwtProvider jwtProvider) {
        this.gitHubService = gitHubService;
        this.userRepo = userRepo;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/github/callback")
    public ResponseEntity<AuthResponse> githubCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String accessToken = gitHubService.exchangeCodeForToken(code);
        Map<String, Object> githubUser = gitHubService.getUserInfo(accessToken);

        String githubId = String.valueOf(githubUser.get("id"));
        String email = (String) githubUser.get("email");
        String name = (String) githubUser.get("name");
        String avatarUrl = (String) githubUser.get("avatar_url");

        if (email == null || email.isBlank()) {
            email = githubId + "@github.local";
        }
        if (name == null || name.isBlank()) {
            name = (String) githubUser.get("login");
        }

        Optional<User> existingUser = userRepo.findByGithubId(githubId);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            Optional<User> emailUser = userRepo.findByEmailIgnoreCase(email);
            if (emailUser.isPresent()) {
                user = emailUser.get();
                user.setGithubId(githubId);
                if (user.getAvatarUrl() == null) {
                    user.setAvatarUrl(avatarUrl);
                }
            } else {
                boolean isAdmin = userRepo.count() == 0;
                user = new User(name, email, "", "", isAdmin);
                user.setGithubId(githubId);
                user.setAvatarUrl(avatarUrl);
            }
            userRepo.save(user);
        }

        String token = jwtProvider.createToken(Map.of(
            "sub", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "is_admin", user.isAdmin()
        ));

        UserResponse userResponse = new UserResponse(
            user.getId(), user.getName(), user.getEmail(),
            user.getInstitution() != null ? user.getInstitution() : "",
            user.isAdmin(), user.getCreatedAt()
        );
        userResponse.setBio(user.getBio() != null ? user.getBio() : "");
        userResponse.setAvatarUrl(user.getAvatarUrl());
        userResponse.setGithubUrl(user.getGithubUrl());
        userResponse.setLinkedinUrl(user.getLinkedinUrl());
        userResponse.setWebsiteUrl(user.getWebsiteUrl());
        userResponse.setHobbies(user.getHobbies());

        return ResponseEntity.ok(new AuthResponse(token, userResponse));
    }
}
```

- [ ] **Step 2: Check JwtProvider.createToken — may use claims map or string subject**

Read `JwtProvider.java` to verify the `createToken` method signature. The code above uses `createToken(Map<String, Object> claims)`. If the existing method uses a different signature (e.g., `createToken(String userId)`), adjust accordingly. For example:

```java
// Alternative if JwtProvider takes subject string:
String token = jwtProvider.createToken(user.getId());
```

- [ ] **Step 3: Check AuthResponse constructor**

Read `AuthResponse.java` to verify it has a constructor `AuthResponse(String token, UserResponse user)`. If it uses different field names, adjust the code accordingly.

- [ ] **Step 4: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/innovationlab/controller/GitHubController.java
git commit -m "feat: add GitHub OAuth callback endpoint"
```

---

### Task 8: Add GitHub Login Button to AuthModal

**Files:**
- Modify: `frontend/src/components/AuthModal.jsx`

- [ ] **Step 1: Read AuthModal.jsx to understand current structure**

Read the file. Note the current import list and component structure.

- [ ] **Step 2: Add Github icon import and login button**

Add `Github` to lucide imports. After the closing `</form>` tag and before the mode-switch/footer area, add:

```jsx
<div className="relative my-4">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="px-2 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">or continue with</span>
  </div>
</div>

<a
  href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID || ""}&scope=read:user,user:email`}
  className="w-full h-10 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
>
  <Github className="w-4 h-4" /> Continue with GitHub
</a>
```

- [ ] **Step 3: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/AuthModal.jsx
git commit -m "feat: add GitHub login button to AuthModal"
```

---

### Task 9: Handle GitHub OAuth Callback in AuthContext

**Files:**
- Modify: `frontend/src/context/AuthContext.jsx`

- [ ] **Step 1: Read AuthContext to understand current structure**

Read the file. Note the current auth response field names (`token` vs `access_token`).

- [ ] **Step 2: Add GitHub callback handling**

Add a `githubToken` state variable:
```jsx
const [githubToken, setGithubToken] = useState(null);
```

In the `useEffect` that runs on mount, add OAuth callback detection before the existing token check:

```jsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    api.post("/auth/github/callback", { code })
      .then((res) => {
        const { token: jwtToken, user: userData } = res.data;
        localStorage.setItem("token", jwtToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
        setToken(jwtToken);
        setUser(userData);
        // Store the GitHub access token from the callback (if returned)
        if (res.data.githubToken) setGithubToken(res.data.githubToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch((err) => {
        console.error("GitHub OAuth failed:", err);
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .finally(() => setLoading(false));
    return;
  }

  // ...existing token check logic...
}, [token]);
```

Add `setGitHubAccessToken` function:
```jsx
const setGitHubAccessToken = (tok) => setGithubToken(tok);
```

Update the context value to include `githubToken` and `setGitHubAccessToken`:
```jsx
<AuthContext.Provider value={{ user, token, loading, login, register, logout, githubToken, setGitHubAccessToken }}>
```

Clear githubToken on logout:
```jsx
const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  setToken(null);
  setUser(null);
  setGithubToken(null);
};
```

- [ ] **Step 3: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/context/AuthContext.jsx
git commit -m "feat: handle GitHub OAuth callback in AuthContext"
```

---

### Task 10: Create GitHubRepoModal Component

**Files:**
- Create: `frontend/src/components/GitHubRepoModal.jsx`

- [ ] **Step 1: Create GitHubRepoModal.jsx**

```jsx
import React, { useState, useEffect } from "react";
import { X, Search, GitBranch, Star, ExternalLink, Loader2 } from "lucide-react";

const GitHubRepoModal = ({ isOpen, onClose, onSelect, githubAccessToken }) => {
  const [repos, setRepos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !githubAccessToken) return;
    setLoading(true);
    setError("");
    fetch("https://api.github.com/user/repos?per_page=100&sort=updated&type=owner", {
      headers: { Authorization: `Bearer ${githubAccessToken}`, Accept: "application/vnd.github+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch repos");
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setFiltered(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, githubAccessToken]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(repos); return; }
    const q = search.toLowerCase();
    setFiltered(repos.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q))
    ));
  }, [search, repos]);

  if (!isOpen) return null;

  const handleSelect = (repo) => {
    onSelect({
      name: repo.name,
      tagline: repo.description ? repo.description.slice(0, 100) : "",
      description: repo.description || "",
      repo_url: repo.html_url,
      tech_stack: repo.language || "",
      homepage: repo.homepage || "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-purple-800 dark:text-purple-300">Import from GitHub</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select a repository to import</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Fetching repos...</span>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={onClose} className="mt-2 text-xs text-purple-600 hover:underline">Close</button>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">No repositories found</p>
            </div>
          )}
          {!loading && !error && filtered.map((repo) => (
            <div
              key={repo.id}
              className="p-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors cursor-pointer"
              onClick={() => handleSelect(repo)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 truncate">{repo.name}</h3>
                    {repo.fork && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">fork</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{repo.description || "No description"}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {repo.language && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {repo.language}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Star className="w-3 h-3" /> {repo.stargazers_count}
                    </span>
                  </div>
                </div>
                <button className="ml-3 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shrink-0 transition-colors">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubRepoModal;
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/GitHubRepoModal.jsx
git commit -m "feat: add GitHubRepoModal component for repo selection"
```

---

### Task 11: Add Import from GitHub to SubmitPage

**Files:**
- Modify: `frontend/src/pages/SubmitPage.jsx`

- [ ] **Step 1: Read SubmitPage to understand structure**

Read the file. Note the `useAuth` import and how form state is managed.

- [ ] **Step 2: Add GitHub import button and modal**

Add imports:
```jsx
import { Github } from "lucide-react";
import GitHubRepoModal from "../components/GitHubRepoModal";
```

Add state:
```jsx
const [showGitHubModal, setShowGitHubModal] = useState(false);
```

Update `useAuth()` destructure to include `githubToken`:
```jsx
const { user, githubToken } = useAuth();
```

Add the import button after the page header section (before the form):
```jsx
{user && githubToken && (
  <div className="flex justify-center mb-6">
    <button
      type="button"
      onClick={() => setShowGitHubModal(true)}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <Github className="w-4 h-4" /> Import from GitHub
    </button>
  </div>
)}
```

Add the modal component before the page's closing `</div>`:
```jsx
<GitHubRepoModal
  isOpen={showGitHubModal}
  onClose={() => setShowGitHubModal(false)}
  onSelect={(repo) => {
    setFormData((prev) => ({
      ...prev,
      name: repo.name,
      tagline: repo.tagline,
      description: repo.description,
      repo_url: repo.repo_url,
      tech_stack: repo.tech_stack,
    }));
  }}
  githubAccessToken={githubToken}
/>
```

- [ ] **Step 3: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/SubmitPage.jsx
git commit -m "feat: add Import from GitHub button to SubmitPage"
```

---

## Phase 3: Notification System

### Task 12: Create Notification Entity + Repository

**Files:**
- Create: `backend/src/main/java/com/innovationlab/model/entity/Notification.java`
- Create: `backend/src/main/java/com/innovationlab/repository/NotificationRepository.java`

- [ ] **Step 1: Create Notification.java**

```java
package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(length = 500)
    private String link;

    @Column(nullable = false)
    private boolean read = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Notification() {}

    public Notification(String id, String userId, String type, String message, String link) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.link = link;
        this.read = false;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
```

- [ ] **Step 2: Create NotificationRepository.java**

```java
package com.innovationlab.repository;

import com.innovationlab.model.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    long countByUserIdAndReadFalse(String userId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId AND n.read = false")
    void markAllReadByUserId(String userId);
}
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/innovationlab/model/entity/Notification.java backend/src/main/java/com/innovationlab/repository/NotificationRepository.java
git commit -m "feat: add Notification entity and repository"
```

---

### Task 13: Create NotificationService + Controller

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/NotificationService.java`
- Create: `backend/src/main/java/com/innovationlab/controller/NotificationController.java`

- [ ] **Step 1: Create NotificationService.java**

```java
package com.innovationlab.service;

import com.innovationlab.model.entity.Notification;
import com.innovationlab.repository.NotificationRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepo;

    public NotificationService(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    public Notification createNotification(String userId, String type, String message, String link) {
        Notification notif = new Notification(
            UUID.randomUUID().toString(), userId, type, message, link
        );
        return notificationRepo.save(notif);
    }

    public List<Notification> getNotifications(String userId, int page, int limit) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(
            userId, PageRequest.of(page, limit)
        );
    }

    public long getUnreadCount(String userId) {
        return notificationRepo.countByUserIdAndReadFalse(userId);
    }

    public void markRead(String notificationId, String userId) {
        notificationRepo.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setRead(true);
                notificationRepo.save(n);
            }
        });
    }

    public void markAllRead(String userId) {
        notificationRepo.markAllReadByUserId(userId);
    }
}
```

- [ ] **Step 2: Create NotificationController.java**

```java
package com.innovationlab.controller;

import com.innovationlab.model.entity.Notification;
import com.innovationlab.security.JwtProvider;
import com.innovationlab.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtProvider jwtProvider;

    public NotificationController(NotificationService notificationService, JwtProvider jwtProvider) {
        this.notificationService = notificationService;
        this.jwtProvider = jwtProvider;
    }

    private String getUserId(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) throw new RuntimeException("Unauthorized");
        return jwtProvider.getSubject(auth.substring(7));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestHeader("Authorization") String auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        String userId = getUserId(auth);
        return ResponseEntity.ok(notificationService.getNotifications(userId, page, limit));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String auth) {
        String userId = getUserId(auth);
        Map<String, Long> result = new HashMap<>();
        result.put("count", notificationService.getUnreadCount(userId));
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
            @RequestHeader("Authorization") String auth,
            @PathVariable String id) {
        String userId = getUserId(auth);
        notificationService.markRead(id, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(
            @RequestHeader("Authorization") String auth) {
        String userId = getUserId(auth);
        notificationService.markAllRead(userId);
        return ResponseEntity.ok().build();
    }
}
```

- [ ] **Step 3: Verify JwtProvider.getSubject method exists**

Read `JwtProvider.java` to confirm the method for extracting subject from token. If it uses a different method name, adjust `getUserId()` accordingly.

- [ ] **Step 4: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/NotificationService.java backend/src/main/java/com/innovationlab/controller/NotificationController.java
git commit -m "feat: add NotificationService and NotificationController"
```

---

### Task 14: Add Notification Trigger Points

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/service/SocialService.java`
- Modify: `backend/src/main/java/com/innovationlab/service/ProjectService.java`

- [ ] **Step 1: Read SocialService to find followUser method**

Read `SocialService.java` to locate `followUser(String followerId, String followedId)`. After the follow is successfully saved, add:

```java
// Notify the followed user
notificationService.createNotification(
    followedId,
    "FOLLOW",
    userRepo.findById(followerId).get().getName() + " started following you",
    "/profile/" + followerId
);
```

Add `NotificationService` as a constructor dependency:
```java
private final NotificationService notificationService;
```

- [ ] **Step 2: Read ProjectService to find toggleVote and toggleBookmark**

Read `ProjectService.java`. Find `toggleVote` method. After successful vote, add:

```java
// Notify project owner (don't notify if voting on own project)
if (!project.getUserId().equals(userId)) {
    User voter = userRepo.findById(userId).orElse(null);
    String verb = vote != null ? "voted on" : "removed vote from";
    notificationService.createNotification(
        project.getUserId(),
        "VOTE",
        (voter != null ? voter.getName() : "Someone") + " " + verb + " " + project.getName(),
        "/project/" + project.getId()
    );
}
```

Find `toggleBookmark` method. After successful bookmark toggle, add:

```java
// Notify project owner
if (!project.getUserId().equals(userId)) {
    User bookmarker = userRepo.findById(userId).orElse(null);
    notificationService.createNotification(
        project.getUserId(),
        "BOOKMARK",
        (bookmarker != null ? bookmarker.getName() : "Someone") + " saved " + project.getName(),
        "/project/" + project.getId()
    );
}
```

Find the comment creation method (may be in a CommentService). After comment is created:

```java
// Notify project owner
if (!project.getUserId().equals(userId)) {
    notificationService.createNotification(
        project.getUserId(),
        "COMMENT",
        (user != null ? user.getName() : "Someone") + " commented on " + project.getName(),
        "/project/" + project.getId()
    );
}
```

Add `NotificationService` and `UserRepository` as constructor dependencies in `ProjectService`.

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/SocialService.java backend/src/main/java/com/innovationlab/service/ProjectService.java
git commit -m "feat: add notification triggers for follow, vote, bookmark, comment"
```

---

### Task 15: Create NotificationBell Component + Integrate into Navbar

**Files:**
- Create: `frontend/src/components/NotificationBell.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Create NotificationBell.jsx**

```jsx
import React, { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data.count || 0);
    } catch (err) { /* silent */ }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications?limit=20");
      setNotifications(res.data || []);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      await api.put(`/notifications/${notif.id}/read`);
    } catch (err) { /* silent */ }
    setIsOpen(false);
    fetchUnreadCount();
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) { /* silent */ }
  };

  if (!user) return null;

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 max-h-[400px] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!n.read ? "bg-purple-50/50 dark:bg-purple-900/10" : ""}`}
                >
                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                    {!n.read && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
```

- [ ] **Step 2: Add NotificationBell to Navbar**

In `Navbar.jsx`, add import:
```jsx
import NotificationBell from "./NotificationBell";
```

Place `<NotificationBell />` next to the theme toggle button (before the user menu area):

```jsx
<div className="flex items-center gap-1">
  <NotificationBell />
  {/* theme toggle button */}
  {/* user menu / auth buttons */}
</div>
```

- [ ] **Step 3: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/NotificationBell.jsx frontend/src/components/Navbar.jsx
git commit -m "feat: add NotificationBell component with dropdown and unread badge"
```

---

## Phase 4: Following Feed

### Task 16: Add Following Feed Query to Backend

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/repository/ProjectRepository.java`
- Modify: `backend/src/main/java/com/innovationlab/controller/ProjectController.java`

- [ ] **Step 1: Read ProjectRepository to understand existing queries**

Read `ProjectRepository.java` to see existing query patterns.

- [ ] **Step 2: Add following feed query to ProjectRepository**

Add a method for fetching projects from followed users:

```java
@Query("SELECT p FROM Project p WHERE p.userId IN " +
       "(SELECT f.followedId FROM Follow f WHERE f.followerId = :userId) " +
       "ORDER BY p.createdAt DESC")
List<Project> findProjectsFromFollowedUsers(@Param("userId") String userId, Pageable pageable);
```

Check if `Follow` entity uses different field names (e.g., `followed_id` / `follower_id`). Read `Follow.java` to confirm.

If a `Follow` entity doesn't exist and follows are managed via a different mechanism (e.g., a `SocialService` with a junction table), adapt the query accordingly. Check if there's a `user_follows` table or similar.

- [ ] **Step 3: Add tab=following support to ProjectController**

Read `ProjectController.java` to understand how `tab` parameter is handled. Add a branch for `tab=following`:

In the `GET /api/projects` method, after extracting `tab` param, add:

```java
if ("following".equals(tab)) {
    String userId = getUserIdFromAuth(auth);
    if (userId == null) return ResponseEntity.status(401).build();
    Pageable pageable = PageRequest.of(page, limit);
    List<Project> projects = projectRepo.findProjectsFromFollowedUsers(userId, pageable);
    long total = projectRepo.countProjectsFromFollowedUsers(userId); // may need @Query count
    return ResponseEntity.ok(Map.of("projects", toResponseList(projects), "total", total));
}
```

Add a count query to `ProjectRepository`:
```java
@Query("SELECT COUNT(p) FROM Project p WHERE p.userId IN " +
       "(SELECT f.followedId FROM Follow f WHERE f.followerId = :userId)")
long countProjectsFromFollowedUsers(@Param("userId") String userId);
```

- [ ] **Step 4: Verify backend compiles**

Run: `cd backend && mvn compile -q`

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/innovationlab/repository/ProjectRepository.java backend/src/main/java/com/innovationlab/controller/ProjectController.java
git commit -m "feat: add following feed query support to backend"
```

---

### Task 17: Add Following Tab to HomePage

**Files:**
- Modify: `frontend/src/pages/HomePage.jsx`

- [ ] **Step 1: Read HomePage to understand tab structure**

Read `HomePage.jsx`. Find the tabs array and how tabs are defined and rendered.

- [ ] **Step 2: Add "Following" tab**

Find the tabs definition (likely an array like `["top", "live", "recent", "updated"]`). Add `"following"`:

```jsx
const tabs = [
  { key: "top", label: "Top" },
  { key: "following", label: "Following" },
  { key: "live", label: "Live" },
  { key: "recent", label: "Recent" },
  { key: "updated", label: "Updated" },
];
```

In the tab content rendering, add a case for `"following"`:

```jsx
{activeTab === "following" && (
  <>
    {loading ? (
      <div className="space-y-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        {[1,2,3,4,5].map((i) => <ProjectCardSkeleton key={i} />)}
      </div>
    ) : listProjects.length > 0 ? (
      <div className="space-y-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {listProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    ) : (
      <div className="py-16 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <p className="text-sm text-gray-500 dark:text-gray-400">Follow users to see their projects here</p>
      </div>
    )}
    <Pagination page={currentPage} total={totalProjects} pageSize={PAGE_SIZE}
      onPageChange={(p) => { setCurrentPage(p); loadTabProjects("following", p); }} />
  </>
)}
```

Update `loadTabProjects` to handle the `"following"` tab similarly to other tabs:
```jsx
const loadTabProjects = async (tab, page = 1) => {
  setLoading(true);
  try {
    const res = await api.get(`/projects?tab=${tab}&page=${page}&limit=${PAGE_SIZE}`);
    setListProjects(res.data.projects || []);
    setTotalProjects(res.data.total || 0);
  } catch (err) { console.error("Failed to load projects:", err); }
  finally { setLoading(false); }
};
```

- [ ] **Step 3: Handle unauthenticated users**

If user is not authenticated, either hide the "Following" tab or show it but with a login prompt:

```jsx
{user ? (
  /* render tabs normally with Following */
) : (
  /* render tabs without Following — filter it out */
)}
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/HomePage.jsx
git commit -m "feat: add Following tab to HomePage"
```

---

## Final Verification

### Task 18: Full Build Verification

- [ ] **Step 1: Backend compile**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 2: Frontend build**

Run: `cd frontend && npx react-scripts build 2>&1 | tail -5`
Expected: "The build folder is ready to be deployed" (or pre-existing `@/index.css` error only)

- [ ] **Step 3: Check git status**

```bash
git status
```
Verify only intended files are modified.

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: platform layer — GitHub OAuth, dark mode, notifications, following feed"
git push
```

---

## Execution Summary

| Phase | Tasks | Components |
|-------|-------|------------|
| 1 | 1-3 | Dark mode: ThemeContext, Navbar toggle, page variants |
| 2 | 4-11 | GitHub OAuth: backend service/controller + frontend modal/button/callback |
| 3 | 12-15 | Notifications: backend entity/service/controller + frontend bell |
| 4 | 16-18 | Following feed: backend query + HomePage tab + final verification |

**Total: 18 tasks**
