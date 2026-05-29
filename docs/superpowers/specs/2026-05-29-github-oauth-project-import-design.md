# GitHub OAuth Login + Project Import Design

## Goal

Enable users to log in with their GitHub account and import their GitHub repositories as competition projects, while keeping existing email/password authentication functional.

## Architecture

### OAuth Flow (Authorization Code)

1. Frontend redirects user to `https://github.com/login/oauth/authorize?client_id=...`
2. User authorizes on GitHub
3. GitHub redirects back to frontend with `?code=xxx`
4. Frontend sends code to `POST /api/auth/github/callback`
5. Backend exchanges code for access token + user info via GitHub API
6. Backend finds existing user by `github_id` or creates new user
7. Backend generates JWT and returns it
8. Frontend stores JWT, updates AuthContext

### Project Import Flow

1. After GitHub login, frontend uses the GitHub access token (stored in memory) to call GitHub API
2. `GET https://api.github.com/user/repos` fetches user's repositories
3. User selects a repo from a modal picker
4. Frontend auto-fills the SubmitPage form with repo data
5. User reviews and submits normally

## Backend Changes

### New Files

**`GitHubController.java`**
- `POST /api/auth/github/callback` (permitAll) - accepts `{ code }`, exchanges for token, creates/finds user, returns `AuthResponse`

**`GitHubService.java`**
- `exchangeCodeForToken(String code)` - POST to `https://github.com/login/oauth/access_token` with client_id, client_secret, code
- `getUserInfo(String accessToken)` - GET `https://api.github.com/user` with Authorization header
- `getUserRepos(String accessToken)` - GET `https://api.github.com/user/repos?per_page=100&sort=updated`
- `getRepoLanguages(String accessToken, String repoUrl)` - GET languages endpoint for a repo

### Modified Files

**`User.java`** - add `githubId` field (nullable, unique)
```java
@Column(name = "github_id", unique = true)
private String githubId;
```

**`UserRepository.java`** - add `findByGithubId(String githubId)`

**`SecurityConfig.java`** - add `/api/auth/github/callback` to permitAll list

**`application.properties`** - add:
```properties
github.client.id=${GITHUB_CLIENT_ID:}
github.client.secret=${GITHUB_CLIENT_SECRET:}
```

## Frontend Changes

### Modified Files

**`AuthModal.jsx`** - add "Continue with GitHub" button between form and footer:
- On click: `window.location.href = "https://github.com/login/oauth/authorize?client_id=...&scope=read:user,user:email"`
- Style: GitHub black button with GitHub icon (lucide `Github`)

**`AuthContext.jsx`** - handle GitHub callback:
- On mount, check URL for `?code=` parameter
- If present, call `POST /auth/github/callback` with the code
- Store returned JWT, update user state
- Clean URL params after successful auth

**`api.js`** - no changes needed (existing axios instance handles JWT)

### New Files

**`GitHubRepoModal.jsx`**
- Props: `isOpen`, `onClose`, `onSelect(repo)`
- Fetches repos from GitHub API using access token from localStorage
- Displays repo list with name, description, language, stars
- Search/filter input
- Select button per repo
- Loading and error states

**`SubmitPage.jsx`** - add "Import from GitHub" button:
- Visible only when logged in via GitHub (check `user.github_id`)
- Opens `GitHubRepoModal`
- On repo select, auto-fills: name, tagline, description, repo_url, tech_stack (from languages)

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `GITHUB_CLIENT_ID` | Backend + Frontend (`REACT_APP_`) | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Backend only | GitHub OAuth app client secret |

## GitHub OAuth App Setup

1. Go to https://github.com/settings/developers
2. New OAuth App
3. Application name: "Innovation Lab"
4. Homepage URL: `https://ilabapp.netlify.app`
5. Authorization callback URL: `https://ilabapp.netlify.app` (frontend handles redirect with code)
6. Copy Client ID and Client Secret

## Error Handling

- GitHub OAuth fails → show error in AuthModal, fall back to email/password
- GitHub API rate limit → show "GitHub rate limit exceeded" toast
- Repo fetch fails → show error in GitHubRepoModal with retry button
- User with same email exists → link GitHub account to existing user (ask for password to confirm, or just auto-link if email matches)

## Security

- Client secret only on backend (never exposed to frontend)
- GitHub access token stored in memory only (not localStorage)
- Rate limiting applies to `/api/auth/github/callback`
- Input sanitization on all GitHub-sourced data (name, description)

## Scope

- GitHub OAuth login (not Google, not other providers)
- Import public repos only (private repos require separate scope)
- Manual repo selection (not auto-import)
- Auto-fill submit form (user still reviews before submitting)
