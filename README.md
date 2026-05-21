# Innovation Lab

South Africa's premier innovation competition platform. Build, compete, and collaborate with developers across the country.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.4, Spring Data JPA |
| Database | PostgreSQL 16 |
| Frontend | React 19, Tailwind CSS, shadcn/ui |
| Auth | Spring Security + JWT (jjwt) |
| Build | Maven (backend), CRA/craco (frontend) |

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 16+
- DBeaver CE or pgAdmin 4 (for database management)

## Setup

### 1. Database

```bash
# Create the database (via DBeaver CE, pgAdmin, or psql)
psql -U postgres -f database/setup.sql
```

Or run the SQL commands in `database/setup.sql` manually.

### 2. Backend

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Build and run
mvn clean package -DskipTests
java -jar target/innovation-lab-1.0.0.jar

# Or with Maven
mvn spring-boot:run
```

The API starts at `http://localhost:8181`.

### 3. Frontend

```bash
cd frontend

# Copy and configure environment
cp .env.example .env
# Edit .env if needed (defaults to localhost:8181)

# Install and start
npm install
npm start
```

The UI starts at `http://localhost:3000`.

### 4. Seed Data

```bash
# After backend is running, seed the database
curl -X POST http://localhost:8181/api/seed
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATASOURCE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/innovationlab` |
| `DATASOURCE_USER` | Database user | `innovationlab` |
| `DATASOURCE_PASSWORD` | Database password | (required) |
| `JWT_SECRET` | JWT signing secret | (required) |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8181` |
| `REACT_APP_POSTHOG_KEY` | PostHog analytics key | (optional) |

## API Overview

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET | `/api/projects` | No |
| GET | `/api/projects/grouped` | No |
| GET | `/api/projects/{id}` | No |
| POST | `/api/projects` | Yes |
| PUT | `/api/projects/{id}` | Yes |
| DELETE | `/api/projects/{id}` | Yes |
| POST | `/api/projects/{id}/vote` | Yes |
| GET | `/api/projects/{id}/comments` | No |
| POST | `/api/projects/{id}/comments` | Yes |
| POST | `/api/projects/{id}/bookmark` | Yes |
| GET | `/api/bookmarks` | Yes |
| GET | `/api/categories` | No |
| GET | `/api/tracks` | No |
| GET | `/api/sponsors` | No |
| GET | `/api/blog` | No |
| GET | `/api/leaderboard` | No |
| GET | `/api/hall-of-fame` | No |
| GET | `/api/stats` | No |
| GET | `/api/search?q=` | No |
| POST | `/api/seed` | No |
| GET | `/api/admin/dashboard` | Admin |
| GET/PUT/DELETE | `/api/admin/users` | Admin |
| GET/DELETE | `/api/admin/projects` | Admin |
| POST/PUT/DELETE | `/api/admin/blog` | Admin |
| POST/PUT/DELETE | `/api/admin/sponsors` | Admin |

## Project Structure

```
PeerPush/
  backend/                        # Spring Boot API
    src/main/java/com/innovationlab/
      Application.java
      config/                     # Security, CORS, exception handling
      controller/                 # REST controllers
      model/
        entity/                   # JPA entities
        dto/                      # Request/response DTOs
      repository/                 # Spring Data repositories
      security/                   # JWT provider and filter
      service/                    # Business logic
    src/main/resources/
      application.properties      # App configuration
  frontend/                       # React SPA
    src/
      components/                 # Reusable UI components
      pages/                      # Page components
      context/                    # Auth context
      services/                   # API client
      data/                       # Static data
  database/
    setup.sql                     # PostgreSQL setup script
  netlify.toml                    # Netlify deployment config
  render.yaml                     # Render deployment config
  docs/superpowers/
    plans/                        # Implementation plans
    specs/                        # Design specifications

## Deployment

### Frontend → Netlify

1. Push to GitHub
2. Connect repo on [netlify.com](https://netlify.com)
3. Settings:
   - **Build command**: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment**: `REACT_APP_BACKEND_URL` = your Render backend URL
4. `netlify.toml` handles SPA redirects automatically

### Backend → Render

1. Push to GitHub
2. Create **Web Service** on [render.com](https://render.com)
3. Settings:
   - **Runtime**: Docker
   - **Build**: Auto-detect (`render.yaml` or `backend/Dockerfile`)
   - **Environment variables**: `DATASOURCE_URL`, `DATASOURCE_USER`, `DATASOURCE_PASSWORD`, `JWT_SECRET`, `ALLOWED_ORIGINS`
4. Or use **render.yaml** for Blueprint deploy

### Shared Database (Universal)

The PostgreSQL database can be shared across multiple projects:
- Each project uses a **different database name** in `DATASOURCE_URL`:
  ```
  jdbc:postgresql://shared-host:5432/innovationlab  # this project
  jdbc:postgresql://shared-host:5432/otherproject    # another project
  ```
- Or use **separate schemas**: `spring.jpa.properties.hibernate.default_schema=innovationlab`
- For Render: Create one PostgreSQL instance, reference it from multiple services with different database names
- Port 8181 for backend, 3000 for frontend dev
```
