# Development History — Innovation Lab

> Last updated: May 21, 2026

## Current State

### Live Deployments

| Service | URL | Status |
|---|---|---|
| Frontend (Netlify) | `https://ilabapp.netlify.app` | Live |
| Backend (Render) | `https://innovation-lab-api.onrender.com` | Live |
| Database (Render) | PostgreSQL 16 | Live |
| GitHub | `https://github.com/Letsoperate/PeerPush` | Main branch |

### Credentials (Demo Only)

| Role | Email | Password | Path |
|---|---|---|---|
| Admin | `ntoampilp@gmail.com` | `admin123` | `/admin/login` |
| Sponsor (MTN) | `mtn@innovationlab.co.za` | `sponsor123` | `/sponsor/login` |
| Sponsor (Standard Bank) | `standardbank@innovationlab.co.za` | `sponsor123` | `/sponsor/login` |
| Sponsor (Takealot) | `takealot@innovationlab.co.za` | `sponsor123` | `/sponsor/login` |
| Sponsor (Investec) | `investec@innovationlab.co.za` | `sponsor123` | `/sponsor/login` |
| Sponsor (Dimension Data) | `dimensiondata@innovationlab.co.za` | `sponsor123` | `/sponsor/login` |
| Sponsor (Naspers) | `naspers@innovationlab.co.za` | `sponsor123` | `/sponsor/login` |
| Student (Lintshiwe) | `221651685@tut4life.ac.za` | `student123` | `/` |

All 10 TUT students: `[studentNumber]@tut4life.ac.za` / `student123`

## Environment Variables

### Netlify
```
REACT_APP_BACKEND_URL = https://innovation-lab-api.onrender.com
```

### Render
```
ALLOWED_ORIGINS = https://ilabapp.netlify.app
JWT_SECRET = (auto-generated)
COMPETITION_END = 2026-08-15
```

## Database

- **42 projects** with real SVGs from `/public/projects/`
- **6 sponsors** with login credentials and website links
- **10 TUT students** with auto-generated avatars (25 different colors)
- **118 comments** seeded across projects
- **12 categories**, **6 tracks**, **8 audiences**
- **6 FAQs**, **4 blog posts**
- Email login is case-insensitive

## Features Implemented

### Public Site
- [x] Homepage with 5-column responsive layout
- [x] Tabs: Top / Live / Recent / Updated
- [x] Project cards with real logos, voting, share, bookmark
- [x] Leaderboard sorted by innovation score
- [x] Hall of Fame page with 10 winners
- [x] Competition Stats with live participant avatars
- [x] Live countdown timer (Days/Hours/Min/Sec to Aug 15)
- [x] Rotating sponsor ads (far left + far right)
- [x] Browse sidebar (Categories, Tracks, Participants)
- [x] How It Works — dynamic competition timeline
- [x] Tutorial video cards
- [x] FAQ section
- [x] Blog page

### User Features
- [x] Register / Login / Logout
- [x] Profile page with HeroUI Avatar, bio, followers
- [x] Follow/unfollow system with counts
- [x] Submit project form
- [x] Edit/delete own projects
- [x] Vote (authenticated only, blocked after competition ends)
- [x] Comment modal with author badge
- [x] Clickable usernames in comments
- [x] Share modal with X/Facebook/LinkedIn/WhatsApp + copy link

### Admin Dashboard (`/admin/login`)
- [x] Dashboard: real-time stats (42 projects, 12 users, 118 comments)
- [x] Users list with avatars, project counts, toggle admin
- [x] Projects CRUD
- [x] Blog posts CRUD
- [x] Sponsors CRUD with real logo images
- [x] Admin redirect on login

### Sponsor Portal (`/sponsor/login`)
- [x] Sponsor login (hidden from main navigation)
- [x] Dashboard with project voting
- [x] Sponsor logo in header
- [x] Project logos in cards

### Security
- [x] JWT auth with BCrypt passwords
- [x] Email case-insensitive login
- [x] Owner-only project edit/delete
- [x] Competition end date voting block
- [x] Anti-copy: right-click, selection, devtools disabled
- [x] AI crawlers blocked (robots.txt + meta tags + HTTP headers)
- [x] LICENSE: © 2026 Lintshiwe (github.com/lintshiwe)

### UI
- [x] Light purple + green color scheme
- [x] ILab bracket logo (SVG)
- [x] HeroUI components: Tabs, Spinner, Skeleton, Avatar
- [x] Lucide icons: Rocket, Ship, ClipboardList, Upload
- [x] Favicon SVG
- [x] OG meta tags for social sharing
- [x] Mobile responsive (sponsor banner, dropdown nav)

## Known Issues / TODO

- [x] Sponsor registration via admin UI (email + password fields)
- [x] Public profile pages (`/profile/:id` with Follow button)
- [x] Sponsor badge — "Sponsored" badge on projects with sponsor votes
- [x] Forgot password link — directs to contact admin
- [x] Screenshot URL field in project submission form
- [ ] Notification system (for comments, follows, wins)
- [ ] Dynamic OG tags for shared project links
- [ ] File upload for project screenshots (URL field added, actual upload pending)

## Project Structure

```
InnovationLab/
  backend/                        # Spring Boot 3.4 + Java 21
    src/main/java/com/innovationlab/
      Application.java
      config/                     # SecurityConfig, CorsConfig, GlobalExceptionHandler
      controller/                 # AuthController, ProjectController, AdminController,
                                  # SocialController, SponsorAuthController,
                                  # StatsController, ReferenceController, SeedController
      model/entity/               # User, Project, Vote, Comment, Bookmark,
                                  # Sponsor, Category, Track, Audience, BlogPost, FAQ
      model/dto/                  # Request/response DTOs
      repository/                 # Spring Data JPA repos
      security/                   # JwtProvider, JwtAuthenticationFilter
      service/                    # AuthService, ProjectService, SeedService
    src/main/resources/
      application.properties
  frontend/                       # React 19 + Tailwind CSS
    src/
      components/                 # ProjectCard, Navbar, Footer, BrowseSidebar,
                                  # RightSidebar, SponsorSidebar, SponsorRightSidebar,
                                  # SponsorBanner, HeroSection, CommentModal, ShareModal
      pages/                      # HomePage, LeaderboardPage, HallOfFamePage,
                                  # HowItWorksPage, SubmitPage, BlogPage,
                                  # ProfilePage, AdminPage, AdminLoginPage,
                                  # SponsorDashboard, SponsorLoginPage
      context/                    # AuthContext
      services/                   # api.js (axios with interceptor)
    public/
      projects/                   # 42 project SVG logos
      sponsors/                   # 6 sponsor logo images
      favicon.svg
      robots.txt
  Dockerfile                      # Multi-stage Maven → JRE build
  render.yaml                     # Render Blueprint
  netlify.toml                    # Netlify config with security headers
  start.sh                        # Local dev: starts DB + backend + frontend
  LICENSE                         # © Lintshiwe
  DOCS.md                         # Full documentation
```

## Quick Start (Local)

```bash
cd InnovationLab
./start.sh
```

This starts PostgreSQL, seeds the database, launches backend on :8181 and frontend on :3000.

## Deploy Commands

```bash
# Seed Render database
curl -X POST https://innovation-lab-api.onrender.com/api/seed

# Register admin
curl -X POST https://innovation-lab-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"ntoampilp@gmail.com","password":"admin123","institution":"Innovation Lab"}'
```
