# VibePush SA - API Contracts & Integration Plan

## API Endpoints

### Auth
- `POST /api/auth/register` → Register user (name, email, password, institution)
- `POST /api/auth/login` → Login (email, password) → JWT token
- `GET /api/auth/me` → Get current user profile (auth required)

### Projects
- `GET /api/projects?tab=top|live|recent|updated&period=today|yesterday|week|month&category=&track=&search=&page=&limit=`
- `GET /api/projects/{id}` → Single project detail
- `POST /api/projects` → Submit project (auth required)
- `PUT /api/projects/{id}` → Update project (auth required, owner only)

### Voting
- `POST /api/projects/{id}/vote` → Toggle upvote (auth required)

### Comments
- `GET /api/projects/{id}/comments` → List comments
- `POST /api/projects/{id}/comments` → Add comment (auth required)

### Bookmarks
- `POST /api/projects/{id}/bookmark` → Toggle bookmark (auth required)
- `GET /api/bookmarks` → User's bookmarks (auth required)

### Static/Reference Data
- `GET /api/categories`
- `GET /api/tracks`
- `GET /api/audiences`
- `GET /api/sponsors`
- `GET /api/faq`
- `GET /api/blog`
- `GET /api/blog/{id}`
- `GET /api/stats` → Competition statistics
- `GET /api/leaderboard?period=all|month|week|today`
- `GET /api/hall-of-fame`

### Seed
- `POST /api/seed` → Seed DB with initial data (categories, tracks, sponsors, projects, blog, faq)

## Mock Data to Replace
All data in `/src/data/mock.js` will be replaced with API calls:
- `competitionStats` → `GET /api/stats`
- `categories` → `GET /api/categories`
- `tracks` → `GET /api/tracks`
- `audiences` → `GET /api/audiences`
- `sponsors` → `GET /api/sponsors`
- `hallOfFame` → `GET /api/hall-of-fame`
- `todayTopProjects`, `yesterdayTopProjects`, `weekTopProjects`, `monthTopProjects` → `GET /api/projects?tab=top&period=X`
- `todayLaunches` → `GET /api/projects?tab=live`
- `blogPosts` → `GET /api/blog`
- `faqData` → `GET /api/faq`
- `howItWorksSteps`, `competitionTimeline` → kept as static frontend data (not DB-driven)
- Leaderboard → `GET /api/leaderboard?period=X`

## MongoDB Collections
- `users` - accounts with hashed passwords
- `projects` - competition entries with computed scores
- `votes` - user_id + project_id pairs
- `comments` - project comments
- `bookmarks` - user_id + project_id pairs
- `categories`, `tracks`, `audiences` - reference data
- `sponsors` - sponsor companies
- `blog_posts` - articles
- `faq` - FAQ items

## Frontend Integration
- Create API service layer (`/src/services/api.js`) with axios
- Replace mock imports with API hooks/calls
- Add AuthContext for login state
- Add loading states and error handling
- Keep `howItWorksSteps` and `competitionTimeline` in frontend (static content)
