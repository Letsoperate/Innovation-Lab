# GitHub OAuth Login + Project Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable GitHub OAuth login and let users import their GitHub repositories as competition projects.

**Architecture:** Authorization Code flow - frontend redirects to GitHub, backend exchanges code for token, creates/finds user, returns JWT. Project import uses GitHub API with user's access token to fetch repos and auto-fill the submit form.

**Tech Stack:** Spring Boot 3.4, Java 21, Spring Security, React 19, Axios, Lucide icons

---

## File Structure

### Backend (new)
- `backend/src/main/java/com/innovationlab/service/GitHubService.java` - OAuth code exchange, GitHub API calls
- `backend/src/main/java/com/innovationlab/controller/GitHubController.java` - Callback endpoint

### Backend (modify)
- `backend/src/main/java/com/innovationlab/model/entity/User.java` - add `githubId` field
- `backend/src/main/java/com/innovationlab/repository/UserRepository.java` - add `findByGithubId`
- `backend/src/main/java/com/innovationlab/config/SecurityConfig.java` - permit callback URL
- `backend/src/main/resources/application.properties` - add GitHub OAuth config

### Frontend (new)
- `frontend/src/components/GitHubRepoModal.jsx` - repo selection modal

### Frontend (modify)
- `frontend/src/components/AuthModal.jsx` - GitHub login button
- `frontend/src/context/AuthContext.jsx` - handle OAuth callback
- `frontend/src/pages/SubmitPage.jsx` - import from GitHub button

---

### Task 1: Add githubId to User Entity

**Files:**
- Modify: `backend/src/main/java/com/innovationlab/model/entity/User.java`
- Modify: `backend/src/main/java/com/innovationlab/repository/UserRepository.java`

- [ ] **Step 1: Add githubId field to User entity**

In `User.java`, add after line 32 (`private String avatarUrl;`):

```java
@Column(name = "github_id", unique = true)
private String githubId;
```

Add getter/setter after the `getAvatarUrl`/`setAvatarUrl` methods:

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

### Task 2: Add GitHub OAuth Config

**Files:**
- Modify: `backend/src/main/resources/application.properties`

- [ ] **Step 1: Add GitHub OAuth properties**

Add to `application.properties`:

```properties
# GitHub OAuth
github.client.id=${GITHUB_CLIENT_ID:}
github.client.secret=${GITHUB_CLIENT_SECRET:}
```

- [ ] **Step 2: Add to SecurityConfig permitAll**

In `SecurityConfig.java`, add `/api/auth/github/callback` to the permitAll list. After line 38 (`.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()`), change to:

```java
.requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/github/callback").permitAll()
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/resources/application.properties backend/src/main/java/com/innovationlab/config/SecurityConfig.java
git commit -m "feat: add GitHub OAuth config and security rules"
```

---

### Task 3: Create GitHubService

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/GitHubService.java`

- [ ] **Step 1: Create GitHubService**

Create `GitHubService.java`:

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

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            "https://api.github.com/user", HttpMethod.GET, request, Map.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to get GitHub user info");
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getUserRepos(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/json");

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<List> response = restTemplate.exchange(
            "https://api.github.com/user/repos?per_page=100&sort=updated&type=owner",
            HttpMethod.GET, request, List.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        return List.of();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Integer> getRepoLanguages(String accessToken, String languagesUrl) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/json");

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            languagesUrl, HttpMethod.GET, request, Map.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        return Map.of();
    }
}
```

- [ ] **Step 2: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/GitHubService.java
git commit -m "feat: add GitHubService for OAuth and API calls"
```

---

### Task 4: Create GitHubController

**Files:**
- Create: `backend/src/main/java/com/innovationlab/controller/GitHubController.java`

- [ ] **Step 1: Create GitHubController**

Create `GitHubController.java`:

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

- [ ] **Step 2: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/controller/GitHubController.java
git commit -m "feat: add GitHub OAuth callback endpoint"
```

---

### Task 5: Add GitHub Login Button to AuthModal

**Files:**
- Modify: `frontend/src/components/AuthModal.jsx`

- [ ] **Step 1: Add GitHub login button**

In `AuthModal.jsx`, add `Github` to the lucide imports (line 4):

```jsx
import { X, LogIn, UserPlus, Github } from "lucide-react";
```

After the closing `</form>` tag (line 116) and before the mode-switch div (line 118), add:

```jsx
<div className="relative my-4">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200"></div>
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="px-2 bg-white text-gray-400">or continue with</span>
  </div>
</div>

<a
  href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID || ""}&scope=read:user,user:email`}
  className="w-full h-10 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
>
  <Github className="w-4 h-4" /> Continue with GitHub
</a>
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build 2>&1 | tail -5`
Expected: "The build folder is ready to be deployed"

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/AuthModal.jsx
git commit -m "feat: add GitHub login button to AuthModal"
```

---

### Task 6: Handle GitHub OAuth Callback in AuthContext

**Files:**
- Modify: `frontend/src/context/AuthContext.jsx`

- [ ] **Step 1: Add GitHub callback handling**

Replace the entire `AuthContext.jsx` with:

```jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      api.post("/auth/github/callback", { code })
        .then((res) => {
          const { access_token, user: userData } = res.data;
          localStorage.setItem("token", access_token);
          api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          setToken(access_token);
          setUser(userData);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error("GitHub OAuth failed:", err);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .finally(() => setLoading(false));
      return;
    }

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem("token", access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, institution) => {
    const res = await api.post("/auth/register", { name, email, password, institution });
    const { access_token, user: userData } = res.data;
    localStorage.setItem("token", access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setGithubToken(null);
  };

  const setGitHubAccessToken = (tok) => setGithubToken(tok);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, githubToken, setGitHubAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build 2>&1 | tail -5`
Expected: "The build folder is ready to be deployed"

- [ ] **Step 3: Commit**

```bash
git add frontend/src/context/AuthContext.jsx
git commit -m "feat: handle GitHub OAuth callback in AuthContext"
```

---

### Task 7: Create GitHubRepoModal Component

**Files:**
- Create: `frontend/src/components/GitHubRepoModal.jsx`

- [ ] **Step 1: Create GitHubRepoModal**

Create `GitHubRepoModal.jsx`:

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
      headers: { Authorization: `Bearer ${githubAccessToken}`, Accept: "application/json" },
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
    if (!search.trim()) {
      setFiltered(repos);
    } else {
      const q = search.toLowerCase();
      setFiltered(repos.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
      ));
    }
  }, [search, repos]);

  if (!isOpen) return null;

  const handleSelect = (repo) => {
    const languages = repo.language ? [repo.language] : [];
    onSelect({
      name: repo.name,
      tagline: repo.description ? repo.description.slice(0, 100) : "",
      description: repo.description || "",
      repo_url: repo.html_url,
      tech_stack: languages.join(", "),
      homepage: repo.homepage || "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-purple-800">Import from GitHub</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select a repository to import</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009639]/20 focus:border-[#009639]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              <span className="ml-2 text-sm text-gray-500">Fetching repos...</span>
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
              <p className="text-sm text-gray-500">No repositories found</p>
            </div>
          )}

          {!loading && !error && filtered.map((repo) => (
            <div
              key={repo.id}
              className="p-3 border border-gray-200 rounded-xl hover:border-[#009639]/30 hover:bg-[#009639]/5 transition-colors cursor-pointer"
              onClick={() => handleSelect(repo)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-purple-800 truncate">{repo.name}</h3>
                    {repo.fork && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">fork</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{repo.description || "No description"}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {repo.language && (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {repo.language}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Star className="w-3 h-3" /> {repo.stargazers_count}
                    </span>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-purple-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" /> GitHub
                    </a>
                  </div>
                </div>
                <button className="ml-3 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 shrink-0">
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

Run: `cd frontend && npm run build 2>&1 | tail -5`
Expected: "The build folder is ready to be deployed"

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/GitHubRepoModal.jsx
git commit -m "feat: add GitHubRepoModal component"
```

---

### Task 8: Add Import from GitHub to SubmitPage

**Files:**
- Modify: `frontend/src/pages/SubmitPage.jsx`

- [ ] **Step 1: Add import button and modal to SubmitPage**

In `SubmitPage.jsx`, add imports at the top (after line 13):

```jsx
import { Github } from "lucide-react";
import GitHubRepoModal from "../components/GitHubRepoModal";
```

Add state after `loading` state (after line 44):

```jsx
const [showGitHubModal, setShowGitHubModal] = useState(false);
const { githubToken } = useAuth();
```

Update the `useAuth` destructure on line 34 to include `githubToken`:

```jsx
const { user, githubToken } = useAuth();
```

Add the import button after the "Submit Entry" header section (after line 108, before the `{submitted && ...}` block):

```jsx
{user && githubToken && (
  <div className="flex justify-center mb-6">
    <button
      type="button"
      onClick={() => setShowGitHubModal(true)}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      <Github className="w-4 h-4" /> Import from GitHub
    </button>
  </div>
)}
```

Add the modal component before the closing `</div>` of the page (before the last `</div>`):

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

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build 2>&1 | tail -5`
Expected: "The build folder is ready to be deployed"

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/SubmitPage.jsx
git commit -m "feat: add Import from GitHub button to SubmitPage"
```

---

### Task 9: Full Build Verification

- [ ] **Step 1: Backend compile**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 2: Frontend build**

Run: `cd frontend && npm run build 2>&1 | tail -5`
Expected: "The build folder is ready to be deployed"

- [ ] **Step 3: Final commit and push**

```bash
git add -A
git commit -m "feat: GitHub OAuth login + project import"
git push
```

- [ ] **Step 4: Verify deployment**

Check `https://ilabapp.netlify.app` and `https://innovation-lab-api.onrender.com/api/health`
