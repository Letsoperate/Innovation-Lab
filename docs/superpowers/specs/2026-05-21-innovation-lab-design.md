# Innovation Lab — De-Emergent & Production Hardening Spec

## Summary

Remove all Emergent platform artifacts, rebrand from VibePush SA to Innovation Lab, port backend from Python/FastAPI/MongoDB to Java/Spring Boot/PostgreSQL, and harden for production.

---

## 1. Files to Delete

| File | Reason |
|---|---|
| `.emergent/emergent.yml` | Emergent platform runtime config |
| `.gitconfig` | Emergent agent git identity (use global git config) |
| `memory/` | Emergent context storage directory |
| `test_result.md` | Emergent platform test protocol |
| `backend/` (Python) | Replaced by Java backend (after verification) |

---

## 2. Frontend Emergent Cleanup

### 2a. `frontend/public/index.html`
- Remove Emergent badge (`<a>` tag linking to `app.emergent.sh`)
- Remove emergent script (`<script src="https://assets.emergent.sh/...">`)
- Update meta description (remove "product of emergent.sh")
- Replace hardcoded PostHog key `phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs` with `%REACT_APP_POSTHOG_KEY%` (CRA env var injection)
- Update `<title>` to "Innovation Lab"

### 2b. `frontend/package.json`
- Remove `@emergentbase/visual-edits` from dependencies

### 2c. `frontend/craco.config.js`
- Remove all visual-edits plugin imports and webpack configuration

### 2d. `frontend/src/index.css`
- Remove `[data-debug-wrapper="true"]` CSS rules (lines 85-115)

---

## 3. Rebrand: VibePush SA → Innovation Lab

### 3a. Backend Java code
- Package name: `com.innovationlab`
- Application name, error messages, JWT issuer, seed data

### 3b. Frontend
- `public/index.html`: `<title>`, meta tags
- `src/pages/*.jsx`: Page titles, headings, text content
- `src/components/*.jsx`: Navbar brand, footer, hero section
- `src/data/mock.js`: Project names, category names
- `contracts.md`: Project name references

### 3c. Replacements
| Old | New |
|---|---|
| VibePush SA | Innovation Lab |
| VibePush | Innovation Lab |
| vibepush | innovationlab |
| vibepush_sa | innovation_lab |
| vibecode | innovate |

---

## 4. Java Backend: Spring Boot + PostgreSQL

### 4a. Stack
- **Spring Boot 3.4** (latest stable)
- **Spring Data JPA** with Hibernate
- **PostgreSQL** (via DBeaver CE/pgAdmin4 management)
- **Spring Security** + **jjwt** for JWT auth
- **Maven** for build
- **Java 21**

### 4b. Project Structure
```
backend/
  pom.xml
  src/main/java/com/innovationlab/
    Application.java
    config/
      SecurityConfig.java
      CorsConfig.java
      WebConfig.java
    controller/
      AuthController.java
      ProjectController.java
      LeaderboardController.java
      CategoryController.java
      BlogController.java
      UserController.java
      StatsController.java
      HealthController.java
    model/
      entity/
        User.java
        Project.java
        Vote.java
        Category.java
        BlogPost.java
      dto/
        LoginRequest.java
        RegisterRequest.java
        ProjectRequest.java
        ...
    repository/
      UserRepository.java
      ProjectRepository.java
      VoteRepository.java
      CategoryRepository.java
      BlogPostRepository.java
    service/
      AuthService.java
      ProjectService.java
      LeaderboardService.java
      ...
    security/
      JwtProvider.java
      JwtAuthenticationFilter.java
  src/main/resources/
    application.properties
    schema.sql
    data.sql
```

### 4c. API Endpoints (unchanged from current contract)

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET | `/api/projects` | No |
| GET | `/api/projects/{id}` | No |
| POST | `/api/projects` | Yes |
| PUT | `/api/projects/{id}` | Yes |
| DELETE | `/api/projects/{id}` | Yes |
| POST | `/api/projects/{id}/vote` | Yes |
| GET | `/api/leaderboard` | No |
| GET | `/api/categories` | No |
| GET | `/api/blog` | No |
| POST | `/api/blog` | Admin |
| GET | `/api/users` | Admin |
| GET | `/api/stats` | No |
| GET | `/api/health` | No |

### 4d. Database Schema (PostgreSQL)

Tables: `users`, `projects`, `votes`, `categories`, `blog_posts`

DDL in `schema.sql`, seed data in `data.sql`.

### 4e. Auth
- Passwords: BCrypt hashed
- JWT: RS256 or HS256 with secret from `JWT_SECRET` env var
- Token expiry: 24h

---

## 5. Production Hardening

### 5a. JWT
- Remove hardcoded fallback secret
- Startup crash with clear error if `JWT_SECRET` env var is missing

### 5b. CORS
- Replace `allow_origins=["*"]` with `ALLOWED_ORIGINS` env var (comma-separated)
- Default: `http://localhost:3000`

### 5c. Environment Variables
- Backend: `DATASOURCE_URL`, `DATASOURCE_USER`, `DATASOURCE_PASSWORD`, `JWT_SECRET`, `ALLOWED_ORIGINS`
- Frontend: `REACT_APP_BACKEND_URL`, `REACT_APP_POSTHOG_KEY`

### 5d. Mock Data Removal
- `HowItWorksPage.jsx`: Replace import from `mock.js` with inline constants
- `mock.js`: Can be deleted after no more imports reference it

### 5e. Mock Data File
- After removing all imports, delete `frontend/src/data/mock.js`

---

## 6. README
- Write proper README with:
  - Project description
  - Tech stack
  - Setup instructions (prerequisites, database setup, env vars, build/run commands)
  - API overview
  - Project structure

---

## 7. Verification
- Backend builds: `mvn clean package`
- Frontend builds: `npm run build`
- Database connectivity via DBeaver CE
- JWT auth flow works end-to-end
- All API endpoints respond correctly
