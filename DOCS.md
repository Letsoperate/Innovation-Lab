# Innovation Lab — Documentation

## Mission

Innovation Lab is a platform that empowers students to transform their ideas into functional tools and systems using **AI-assisted development** — no coding experience required. We believe the next billion-rand idea lives in a student's mind, not in their ability to write code.

### The Problem
Industries, companies, and government departments need practical digital tools every day — but they don't know where to find them, and students with brilliant ideas don't have a platform to showcase them.

### Our Solution
Innovation Lab bridges this gap. Students submit their AI-built projects to compete, get community votes, and climb leaderboards. Companies browse the platform to discover tools they can use, sponsor, or acquire — creating a **marketplace for student innovation**.

### How It Works
1. **Students** use AI tools (ChatGPT, Claude, Copilot, etc.) to build anything useful — apps, dashboards, automation tools, analytics systems
2. **No coding required** — AI handles the technical implementation. The value is in the **idea** and **execution**
3. **Submit** to Innovation Lab for community voting and visibility
4. **Companies & departments** discover tools they need, sponsor projects, or acquire solutions
5. **Students earn** recognition, prizes, sponsorships, and potential revenue from their ideas

### Vision
To become Africa's premier marketplace where student innovation meets industry demand — turning classroom ideas into enterprise solutions, powered by AI.

---

South Africa's premier innovation competition platform. Build, compete, and collaborate with developers across the country.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.4, Spring Data JPA |
| Database | PostgreSQL 16 |
| Frontend | React 19, Tailwind CSS, HeroUI, Lucide Icons |
| Auth | Spring Security + JWT (jjwt) |
| Deployment | Render (backend + DB), Netlify (frontend) |

## Features

### Main Site (Public)
- **Home Page** — 42 projects displayed with grouped views (Today, Yesterday, This Week, This Month, Older)
- **Tabs** — Top / Live / Recent / Updated project views
- **Leaderboard** — Ranked projects by innovation score
- **Hall of Fame** — Award-winning projects with badges
- **Search** — Search projects by name, tagline, description
- **Browse** — Filter by Categories, Tracks, Participants
- **Competition Stats** — Real-time project count, total votes, active participants with avatars
- **Live Countdown** — Days/Hours/Minutes/Seconds to Finals
- **Sponsors** — Rotating sponsor cards with official website links
- **Tutorial Videos** — How to use, earn points, winners announced

### User Features
- **Register / Login** — Create an account with name, email, password
- **Profile** — Bio, followers/following, project list, bookmarks
- **Submit Project** — Submit your project with details, links, tech stack
- **Vote** — Upvote any project (authenticated users only)
- **Comment** — Open comment section on any project, see author badges
- **Share** — Share projects to X/Twitter, Facebook, LinkedIn, WhatsApp with copy link
- **Bookmark** — Save projects to your collection
- **Follow** — Follow other users, see followers/following counts

### Admin Dashboard (`/admin/login`)
- Manage users, projects, blog posts, sponsors
- View dashboard with site-wide statistics
- Toggle admin status on users
- Create/edit/delete blog posts and sponsors
- Admin demo: `Admin@gmail.com` / `admin123`

### Sponsor Portal (`/sponsor/login`)
- Vote on projects as a sponsor
- View all projects with stats
- Sponsor votes contribute to final scoring

## Navigation

| Page | Path | Access |
|---|---|---|
| Home | `/` | Public |
| How It Works | `/how-it-works` | Public |
| Leaderboard | `/leaderboard` | Public |
| Hall of Fame | `/hall-of-fame` | Public |
| Blog | `/blog` | Public |
| Submit Project | `/submit` | Authenticated |
| Profile | `/profile` | Authenticated |
| Admin Dashboard | `/admin` | Admin only |
| Admin Login | `/admin/login` | Public |
| Sponsor Login | `/sponsor/login` | Public (hidden) |
| Sponsor Dashboard | `/sponsor/dashboard` | Sponsor only |

## How to Use

### 1. Browsing Projects
Visit the home page. Use the tabs (Top/Live/Recent/Updated) to filter projects. The left sidebar has Browse categories, tracks, and participants. The right sidebar shows competition stats, Hall of Fame, sponsor cards, and latest blog updates.

### 2. Registering & Logging In
Click **Sign up** in the top-right corner. Fill in your name, email, and password. After registering, you're automatically logged in.

### 3. Submitting a Project
After logging in, click your profile or navigate to `/submit`. Fill in:
- Project name, tagline, description
- Demo URL, repository URL, video URL
- Category, competition track
- Team name, team size, institution
- Tech stack

### 4. Voting
Click the upvote arrow on any project card. You must be logged in to vote. Votes are toggleable — clicking again removes your vote.

### 5. Commenting
Click **Comment** on any project to open the comment section. Project authors have a green **Author** badge. Click any username to view their profile.

### 6. Sharing
Click **Share** on any project to open the share modal with X/Twitter, Facebook, LinkedIn, and WhatsApp buttons. Use the Copy button to copy the project link.

### 7. Following Users
Click a username in comments to view their profile. Use the Follow button to follow/unfollow users. Your profile shows followers and following counts with avatars.

### 8. Competition Rules
The competition has 5 phases shown in the header timeline:
1. **Registration** — 14 days, open to everyone
2. **Building Phase** — Submit and refine projects
3. **Community Voting** — Users vote and interact with projects
4. **Semi-Finals** — Voting closes, judging begins
5. **Finals & Awards** — Winners announced on August 15

### 9. Earning Points
The Innovation Score is calculated from:
- Community upvotes
- Comments and engagement
- Shares and bookmarks
- Sponsor votes (during semi-finals)

## API Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET | `/api/projects` | No |
| GET | `/api/projects/grouped` | No |
| POST | `/api/projects` | Yes |
| PUT | `/api/projects/{id}` | Yes |
| DELETE | `/api/projects/{id}` | Yes |
| POST | `/api/projects/{id}/vote` | Yes |
| GET | `/api/projects/{id}/comments` | No |
| POST | `/api/projects/{id}/comments` | Yes |
| POST | `/api/projects/{id}/bookmark` | Yes |
| GET | `/api/bookmarks` | Yes |
| POST | `/api/sponsor/login` | No |
| GET | `/api/leaderboard` | No |
| GET | `/api/hall-of-fame` | No |
| GET | `/api/stats` | No |
| GET | `/api/search?q=` | No |
| POST | `/api/seed` | No |
| GET | `/api/users` | No |
| POST | `/api/users/{id}/follow` | Yes |
| GET | `/api/admin/dashboard` | Admin |

## Local Development

```bash
# Start everything
./start.sh

# Or individually
cd backend && mvn spring-boot:run     # Backend on :8181
cd frontend && npm start              # Frontend on :3000

# Seed database
curl -X POST http://localhost:8181/api/seed
```

## Deployment

- **Frontend**: Netlify — auto-deploys on push to `main`
- **Backend**: Render — Docker auto-deploy
- **Database**: Render PostgreSQL

## Project Structure

```
InnovationLab/
  backend/                        # Spring Boot API
    src/main/java/com/innovationlab/
      Application.java
      config/                     # Security, CORS, exceptions
      controller/                 # REST controllers
      model/entity/               # JPA entities (11 total)
      model/dto/                  # Request/response DTOs
      repository/                 # Spring Data repositories
      security/                   # JWT provider and filter
      service/                    # Business logic
  frontend/                       # React SPA
    src/
      components/                 # Reusable UI (ProjectCard, Navbar, etc.)
      pages/                      # Page components
      context/                    # Auth context
      services/                   # API client (axios)
  database/setup.sql              # PostgreSQL setup
  netlify.toml                    # Netlify config
  render.yaml                     # Render config
  start.sh                        # Local dev startup script
```

## Competition Schedule

Innovation Lab operates in cycles throughout the year, giving students multiple opportunities to participate without disrupting their academic studies.

- **Frequency**: 2–4 competition cycles per year, depending on sponsor support
- **Duration**: Each cycle runs approximately 3 months (Registration → Finals)
- **Flexibility**: Students can join any cycle, work from anywhere, at any time
- **Study-Friendly**: No fixed schedules — students build at their own pace alongside their studies
- **Sponsor-Dependent**: More sponsors = more cycles. Each cycle requires sponsor funding for prizes, mentorship, and platform operation

The goal is to create a sustainable ecosystem where sponsors support student innovation year-round, and students can turn their ideas into tools whenever inspiration strikes — not just once a year.
