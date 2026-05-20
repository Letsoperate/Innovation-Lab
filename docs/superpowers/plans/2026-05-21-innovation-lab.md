# Innovation Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Emergent platform artifacts, rebrand VibePush SA to Innovation Lab, port backend from Python/FastAPI/MongoDB to Java/Spring Boot/PostgreSQL, and harden for production.

**Architecture:** Spring Boot 3.4 + PostgreSQL backend replacing Python/FastAPI/MongoDB. Frontend React UI unchanged. PostgreSQL managed via DBeaver CE. API contract preserved — same endpoints, same JSON shapes.

**Tech Stack:** Java 21, Spring Boot 3.4, Spring Data JPA, PostgreSQL 16, Spring Security + jjwt, Maven 3.9, React 19, CRA/craco, Tailwind CSS

---

### Task 1: Delete Emergent Files

**Files:**
- Delete: `.emergent/emergent.yml`
- Delete: `.gitconfig`
- Delete: `memory/.gitkeep` and `memory/` directory
- Delete: `test_result.md`
- Delete: `test_reports/` directory

- [ ] **Step 1: Remove all Emergent files and directories**

```bash
rm -rf .emergent/ .gitconfig memory/ test_result.md test_reports/
```

- [ ] **Step 2: Verify files are gone**

```bash
ls -la .emergent .gitconfig memory test_result.md test_reports 2>&1 | grep "No such file"
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove Emergent platform artifacts"
```

---

### Task 2: Clean Frontend HTML

**Files:**
- Modify: `frontend/public/index.html`

- [ ] **Step 1: Remove Emergent badge, script, CRA comments, update title, meta, PostHog key**

Replace entire `frontend/public/index.html` with:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Innovation Lab — Where South Africa's builders compete, collaborate, and create." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        <title>Innovation Lab — Build. Compete. Innovate.</title>
        <script>window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);</script>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script>
            !(function (t, e) {
                var o, n, p, r;
                e.__SV ||
                    ((window.posthog = e),
                    (e._i = []),
                    (e.init = function (i, s, a) {
                        function g(t, e) {
                            var o = e.split(".");
                            2 == o.length && ((t = t[o[0]]), (e = o[1])),
                                (t[e] = function () {
                                    t.push(
                                        [e].concat(
                                            Array.prototype.slice.call(
                                                arguments,
                                                0,
                                            ),
                                        ),
                                    );
                                });
                        }
                        ((p = t.createElement("script")).type =
                            "text/javascript"),
                            (p.crossOrigin = "anonymous"),
                            (p.async = !0),
                            (p.src =
                                s.api_host.replace(
                                    ".i.posthog.com",
                                    "-assets.i.posthog.com",
                                ) + "/static/array.js"),
                            (r =
                                t.getElementsByTagName(
                                    "script",
                                )[0]).parentNode.insertBefore(p, r);
                        var u = e;
                        for (
                            void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
                                u.people = u.people || [],
                                u.toString = function (t) {
                                    var e = "posthog";
                                    return (
                                        "posthog" !== a && (e += "." + a),
                                        t || (e += " (stub)"),
                                        e
                                    );
                                },
                                u.people.toString = function () {
                                    return u.toString(1) + ".people (stub)";
                                },
                                o =
                                    "init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(
                                        " ",
                                    ),
                                n = 0;
                            n < o.length;
                            n++
                        )
                            g(u, o[n]);
                        e._i.push([i, s, a]);
                    }),
                    (e.__SV = 1));
            })(document, window.posthog || []);
            posthog.init("%REACT_APP_POSTHOG_KEY%", {
                api_host: "https://us.i.posthog.com",
                person_profiles: "identified_only",
                session_recording: {
                    recordCrossOriginIframes: true,
                    capturePerformance: false,
                },
            });
        </script>
    </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/public/index.html && git commit -m "chore: remove Emergent badge, script, hardcoded PostHog key from index.html"
```

---

### Task 3: Remove Visual Edits from Frontend Dependencies

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/craco.config.js`

- [ ] **Step 1: Remove `@emergentbase/visual-edits` from package.json**

In `frontend/package.json`, remove line:
```
"@emergentbase/visual-edits": "https://assets.emergent.sh/npm/@emergentbase/visual-edits-0.0.82.tgz",
```

- [ ] **Step 2: Simplify craco.config.js — remove visual-edits wrapper**

Replace `frontend/craco.config.js` with:

```js
const path = require("path");

module.exports = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/build/**',
          '**/dist/**',
          '**/coverage/**',
          '**/public/**',
        ],
      };
      return webpackConfig;
    },
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/craco.config.js && git commit -m "chore: remove visual-edits and health-check plugins"
```

---

### Task 4: Remove Debug CSS

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Remove `[data-debug-wrapper]` CSS rules**

In `frontend/src/index.css`, remove lines 85-115 (the entire `[data-debug-wrapper]` block).

- [ ] **Step 2: Commit**

```bash
git add frontend/src/index.css && git commit -m "chore: remove visual-edits debug CSS"
```

---

### Task 5: Rebrand Frontend Text

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`
- Modify: `frontend/src/components/Footer.jsx`
- Modify: `frontend/src/pages/HowItWorksPage.jsx`
- Modify: `frontend/src/pages/HomePage.jsx`
- Modify: `frontend/src/components/HeroSection.jsx`
- Modify: `frontend/src/pages/SubmitPage.jsx`
- Modify: `frontend/src/pages/LeaderboardPage.jsx`
- Modify: `frontend/src/components/RightSidebar.jsx`
- Modify: `frontend/src/data/mock.js`

- [ ] **Step 1: Rebrand Navbar.jsx — update brand text "VibePush SA" → "Innovation Lab"**

```js
// In Navbar.jsx, change the logo/brand text:
// Old: VibePush<span className="text-[#009639]"> SA</span>
// New: Innovation<span className="text-[#009639]"> Lab</span>
```

- [ ] **Step 2: Rebrand Footer.jsx — update footer branding**

```js
// Change line 81: "VibePush<span className=\"text-[#009639]\"> SA</span>" 
// To: "Innovation<span className=\"text-[#009639]\"> Lab</span>"
// Change line 85: "Vibe coding competition for South Africa's builders."
// To: "South Africa's premier innovation competition platform."
```

- [ ] **Step 3: Rebrand HowItWorksPage.jsx — update competition references**

```js
// Line 32: "VibePush SA Competition" → "Innovation Lab Competition"
// Line 39: "South Africa's biggest vibe coding competition" → "South Africa's premier innovation competition"
// Also update any "vibe coding" references → "innovation" in the howItWorksSteps data
// Line 85 timeline header: "VibePush SA Competition Timeline" → "Innovation Lab Timeline"
```

- [ ] **Step 4: Rebrand HomePage.jsx — update page titles and text**

Replace all occurrences:
- "VibePush SA" → "Innovation Lab"
- "vibe coding" → "innovation"
- "vibe-coded" → "innovative"

- [ ] **Step 5: Rebrand HeroSection.jsx**

Replace all occurrences:
- "VibePush" → "Innovation Lab"
- "vibe coding" / "vibe-coded" → "innovation" / "innovative"

- [ ] **Step 6: Rebrand SubmitPage.jsx, LeaderboardPage.jsx, RightSidebar.jsx**

Replace all "VibePush" references → "Innovation Lab", "vibe" → "innovate" where appropriate.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/ && git commit -m "refactor: rebrand VibePush SA to Innovation Lab throughout frontend"
```

---

### Task 6: Move howItWorksSteps into HowItWorksPage

**Files:**
- Modify: `frontend/src/pages/HowItWorksPage.jsx`

- [ ] **Step 1: Replace mock.js import with inline data**

In `HowItWorksPage.jsx`, remove line 3:
```js
import { howItWorksSteps, competitionTimeline } from "../data/mock";
```

Add inline constants at top of file (before component):
```js
const howItWorksSteps = [
  { step: 1, title: "Register Your Team", description: "Create a free account, form your team (1-4 members), and verify your institutional affiliation. Registration takes less than 5 minutes." },
  { step: 2, title: "Build Your Project", description: "Use innovation techniques and AI tools to build something amazing. There are no restrictions on tech stack — use whatever gets you in the zone." },
  { step: 3, title: "Submit & Launch", description: "Submit your project with a description, demo video, screenshots, and tech stack details. Your project goes live for community voting immediately." },
  { step: 4, title: "Get Votes & Feedback", description: "The community votes on projects. Engage with other builders, get feedback, iterate on your project, and climb the rankings." },
  { step: 5, title: "Win Prizes", description: "Top projects advance to finals judged by industry experts. Winners receive cash prizes, mentorship, incubation, and more." },
];

const competitionTimeline = [
  { phase: "Registration Open", date: "1 June 2025", status: "completed" },
  { phase: "Building Phase", date: "15 June - 15 July 2025", status: "completed" },
  { phase: "Community Voting", date: "1 July - 31 July 2025", status: "active" },
  { phase: "Semi-Finals", date: "1 - 7 August 2025", status: "upcoming" },
  { phase: "Finals & Awards", date: "15 August 2025", status: "upcoming" },
];
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/HowItWorksPage.jsx && git commit -m "refactor: inline howItWorksSteps in HowItWorksPage, remove mock.js dependency"
```

---

### Task 7: Create .env.example for Frontend

**Files:**
- Create: `frontend/.env.example`
- Modify: `frontend/src/services/api.js`

- [ ] **Step 1: Create `frontend/.env.example`**

```
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_POSTHOG_KEY=phc_your_posthog_key_here
```

- [ ] **Step 2: Add fallback to api.js for development**

```js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
```

- [ ] **Step 3: Commit**

```bash
git add frontend/.env.example frontend/src/services/api.js && git commit -m "feat: add .env.example and fallback URL for frontend API"
```

---

### Task 8: Create Spring Boot Backend Project Skeleton

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/innovationlab/Application.java`
- Create: `backend/src/main/resources/application.properties`

- [ ] **Step 1: Create Maven project directory structure**

```bash
mkdir -p backend/src/main/java/com/innovationlab/{config,controller,model/entity,model/dto,repository,service,security}
mkdir -p backend/src/main/resources
mkdir -p backend/src/test/java/com/innovationlab
mkdir -p data
```

- [ ] **Step 2: Write `backend/pom.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.1</version>
        <relativePath/>
    </parent>
    <groupId>com.innovationlab</groupId>
    <artifactId>innovation-lab</artifactId>
    <version>1.0.0</version>
    <name>Innovation Lab API</name>
    <description>Innovation Lab competition platform backend</description>
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 3: Write `backend/src/main/java/com/innovationlab/Application.java`**

```java
package com.innovationlab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

- [ ] **Step 4: Write `backend/src/main/resources/application.properties`**

```properties
server.port=8080

# Database
spring.datasource.url=${DATASOURCE_URL:jdbc:postgresql://localhost:5432/innovationlab}
spring.datasource.username=${DATASOURCE_USER:innovationlab}
spring.datasource.password=${DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false
spring.jpa.open-in-view=false

# JWT
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-hours=72

# CORS
app.cors.allowed-origins=${ALLOWED_ORIGINS:http://localhost:3000}
```

- [ ] **Step 5: Commit**

```bash
git add backend/pom.xml backend/src/main/java/com/innovationlab/Application.java backend/src/main/resources/application.properties && git commit -m "feat: add Spring Boot project skeleton with PostgreSQL support"
```

---

### Task 9: Create Entity Models

**Files:**
- Create: `backend/src/main/java/com/innovationlab/model/entity/User.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Project.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Vote.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Comment.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Bookmark.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Category.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Track.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Audience.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/Sponsor.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/BlogPost.java`
- Create: `backend/src/main/java/com/innovationlab/model/entity/FAQ.java`

- [ ] **Step 1: Write `User.java`**

```java
package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String institution;

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public User() {}

    public User(String name, String email, String passwordHash, String institution, boolean isAdmin) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.institution = institution;
        this.isAdmin = isAdmin;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
```

- [ ] **Step 2: Write `Project.java`**

```java
package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "demo_url")
    private String demoUrl;

    @Column(name = "repo_url")
    private String repoUrl;

    @Column(name = "video_url")
    private String videoUrl;

    private String category;
    private String track;
    private String institution;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "team_size")
    private int teamSize = 1;

    @Column(name = "tech_stack")
    private String techStack;

    @Column(name = "logo_color")
    private String logoColor = "#009639";

    @Column(name = "logo_initial")
    private String logoInitial;

    private int upvotes = 0;
    private int views = 0;

    @Column(name = "comments_count")
    private int commentsCount = 0;

    private double rating = 0.0;

    @Column(name = "vibe_push_score")
    private int vibePushScore = 0;

    @Column(name = "is_trending")
    private boolean isTrending = true;

    @Column(name = "has_video")
    private boolean hasVideo = false;

    @Column(name = "is_featured")
    private boolean isFeatured = false;

    private int rank = 0;

    @Column(name = "rank_label")
    private String rankLabel;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Project() {}

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }
    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTrack() { return track; }
    public void setTrack(String track) { this.track = track; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public int getTeamSize() { return teamSize; }
    public void setTeamSize(int teamSize) { this.teamSize = teamSize; }
    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }
    public String getLogoColor() { return logoColor; }
    public void setLogoColor(String logoColor) { this.logoColor = logoColor; }
    public String getLogoInitial() { return logoInitial; }
    public void setLogoInitial(String logoInitial) { this.logoInitial = logoInitial; }
    public int getUpvotes() { return upvotes; }
    public void setUpvotes(int upvotes) { this.upvotes = upvotes; }
    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getVibePushScore() { return vibePushScore; }
    public void setVibePushScore(int vibePushScore) { this.vibePushScore = vibePushScore; }
    public boolean isTrending() { return isTrending; }
    public void setTrending(boolean trending) { isTrending = trending; }
    public boolean isHasVideo() { return hasVideo; }
    public void setHasVideo(boolean hasVideo) { this.hasVideo = hasVideo; }
    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
    public String getRankLabel() { return rankLabel; }
    public void setRankLabel(String rankLabel) { this.rankLabel = rankLabel; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
```

- [ ] **Step 3: Write remaining entities (Vote.java, Comment.java, Bookmark.java, Category.java, Track.java, Audience.java, Sponsor.java, BlogPost.java, FAQ.java)**

```
Vote: id, projectId, userId, createdAt
Comment: id, projectId, userId, userName, text, createdAt
Bookmark: id, projectId, userId, createdAt
Category: id, name, slug, count
Track: id, name, slug
Audience: id, name, slug
Sponsor: id, name, description, logo, color, textColor
BlogPost: id, title, excerpt, content, date, category, readTime
FAQ: id, question, answer
```

Each follows same pattern as User/Project with UUID id, field mappings, getters/setters.

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/innovationlab/model/ && git commit -m "feat: add JPA entity models for all collections"
```

---

### Task 10: Create Repositories

**Files:**
- Create: `backend/src/main/java/com/innovationlab/repository/UserRepository.java`
- Create: all other repositories

- [ ] **Step 1: Write all repository interfaces**

```java
// UserRepository.java
package com.innovationlab.repository;

import com.innovationlab.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByOrderByCreatedAtAsc();
    Optional<User> findFirstByIsAdminTrue();
    boolean existsByIsAdminTrue();
    long countByCreatedAtAfter(java.time.Instant date);
}

// ProjectRepository.java
public interface ProjectRepository extends JpaRepository<Project, String> {
    long countByUserId(String userId);
    long countByCreatedAtAfter(Instant date);
    List<Project> findByUserId(String userId, Sort sort);
}
```

Similarly for Vote, Comment, Bookmark, Category, Track, Audience, Sponsor, BlogPost, FAQ repositories.

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/innovationlab/repository/ && git commit -m "feat: add Spring Data JPA repositories"
```

---

### Task 11: Create DTOs

**Files:**
- Create: `backend/src/main/java/com/innovationlab/model/dto/*.java`

- [ ] **Step 1: Write Request/Response DTOs**

```java
// LoginRequest.java
package com.innovationlab.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
    // getters/setters
}

// RegisterRequest.java
public class RegisterRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank private String password;
    private String institution;
    // getters/setters
}

// AuthResponse.java
public class AuthResponse {
    private String accessToken;
    private String tokenType = "bearer";
    private UserResponse user;
    // constructor/getters
}

// UserResponse.java
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String institution;
    private boolean isAdmin;
    private Instant createdAt;
    // constructor/getters
}

// ProjectRequest.java (for POST/PUT)
// ProjectResponse.java (matches Python ProjectResponse)
// VoteResponse.java
// CommentRequest.java / CommentResponse.java
// BookmarkResponse.java
// StatsResponse.java
// HallOfFameItem.java
// BlogPostRequest.java / BlogPostResponse.java
// SponsorRequest.java / SponsorResponse.java
// ProfileUpdateRequest.java
```

All DTOs mirror the Python Pydantic models from `backend/models.py`.

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/innovationlab/model/dto/ && git commit -m "feat: add request/response DTOs"
```

---

### Task 12: Create JWT Security

**Files:**
- Create: `backend/src/main/java/com/innovationlab/security/JwtProvider.java`
- Create: `backend/src/main/java/com/innovationlab/security/JwtAuthenticationFilter.java`

- [ ] **Step 1: Write `JwtProvider.java`**

```java
package com.innovationlab.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
public class JwtProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtProvider(@Value("${app.jwt.secret}") String secret,
                       @Value("${app.jwt.expiration-hours}") long expirationHours) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET environment variable is required");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationHours * 3600_000L;
    }

    public String createToken(Map<String, Object> claims) {
        Date now = new Date();
        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token).getPayload();
        } catch (JwtException e) {
            return null;
        }
    }
}
```

- [ ] **Step 2: Write `JwtAuthenticationFilter.java`**

```java
package com.innovationlab.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            var claims = jwtProvider.validateToken(token);
            if (claims != null) {
                var auth = new UsernamePasswordAuthenticationToken(claims, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/security/ && git commit -m "feat: add JWT provider and authentication filter"
```

---

### Task 13: Create Security and CORS Configuration

**Files:**
- Create: `backend/src/main/java/com/innovationlab/config/SecurityConfig.java`
- Create: `backend/src/main/java/com/innovationlab/config/CorsConfig.java`

- [ ] **Step 1: Write `SecurityConfig.java`**

```java
package com.innovationlab.config;

import com.innovationlab.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers("/api/health", "/api/stats", "/api/categories",
                    "/api/tracks", "/api/audiences", "/api/sponsors", "/api/faq",
                    "/api/blog", "/api/blog/**", "/api/leaderboard", "/api/hall-of-fame",
                    "/api/projects", "/api/projects/grouped", "/api/search", "/api/seed").permitAll()
                .requestMatchers("/api/admin/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

- [ ] **Step 2: Write `CorsConfig.java`**

```java
package com.innovationlab.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/config/ && git commit -m "feat: add security and CORS configuration"
```

---

### Task 14: Create Auth Service and Controller

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/AuthService.java`
- Create: `backend/src/main/java/com/innovationlab/controller/AuthController.java`

- [ ] **Step 1: Write `AuthService.java`**

```java
package com.innovationlab.service;

import com.innovationlab.model.dto.*;
import com.innovationlab.model.entity.User;
import com.innovationlab.repository.UserRepository;
import com.innovationlab.security.JwtProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtProvider jwtProvider) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtProvider = jwtProvider;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        boolean isAdmin = userRepo.count() == 0;
        User user = new User(
            req.getName(), req.getEmail(),
            encoder.encode(req.getPassword()),
            req.getInstitution() != null ? req.getInstitution() : "",
            isAdmin
        );
        userRepo.save(user);

        String token = jwtProvider.createToken(Map.of(
            "sub", user.getId(),
            "email", user.getEmail(),
            "name", user.getName()
        ));

        return new AuthResponse(token, toResponse(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtProvider.createToken(Map.of(
            "sub", user.getId(),
            "email", user.getEmail(),
            "name", user.getName()
        ));
        return new AuthResponse(token, toResponse(user));
    }

    public UserResponse getMe(Map<String, Object> claims) {
        User user = userRepo.findById((String) claims.get("sub"))
            .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateProfile(Map<String, Object> claims, ProfileUpdateRequest req) {
        User user = userRepo.findById((String) claims.get("sub"))
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getInstitution() != null) user.setInstitution(req.getInstitution());
        userRepo.save(user);
        return toResponse(user);
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(),
            u.getInstitution(), u.isAdmin(), u.getCreatedAt());
    }
}
```

- [ ] **Step 2: Write `AuthController.java`**

```java
package com.innovationlab.controller;

import com.innovationlab.model.dto.*;
import com.innovationlab.service.AuthService;
import com.innovationlab.security.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;

    public AuthController(AuthService authService, JwtProvider jwtProvider) {
        this.authService = authService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@RequestHeader("Authorization") String auth) {
        var claims = jwtProvider.validateToken(auth.replace("Bearer ", ""));
        if (claims == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(authService.getMe(claims));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@RequestHeader("Authorization") String auth,
                                                       @RequestBody ProfileUpdateRequest req) {
        var claims = jwtProvider.validateToken(auth.replace("Bearer ", ""));
        if (claims == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(authService.updateProfile(claims, req));
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/AuthService.java backend/src/main/java/com/innovationlab/controller/AuthController.java && git commit -m "feat: add auth service and controller (register, login, me)"
```

---

### Task 15: Create Project Service and Controller

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/ProjectService.java`
- Create: `backend/src/main/java/com/innovationlab/controller/ProjectController.java`

- [ ] **Step 1: Write `ProjectService.java` with full CRUD + voting + comments + bookmarks**

The service mirrors all Python endpoints:
- listProjects(tab, period, category, track, search, page, limit)
- getGroupedProjects()
- getProject(id)
- createProject(data, userId)
- updateProject(id, data, userId)
- toggleVote(projectId, userId)
- voteStatus(projectId, userId)
- getComments(projectId)
- addComment(projectId, text, userId, userName)
- toggleBookmark(projectId, userId)
- getBookmarks(userId)
- getBookmarkIds(userId)
- getVoteIds(userId)
- deleteProject(id, userId, isAdmin)

- [ ] **Step 2: Write `ProjectController.java` with all /api/projects and /api endpoints**

Exact same endpoint paths as Python:
- GET /api/projects
- GET /api/projects/grouped
- GET /api/projects/{id}
- POST /api/projects
- PUT /api/projects/{id}
- POST /api/projects/{id}/vote
- GET /api/projects/{id}/vote-status
- GET /api/projects/{id}/comments
- POST /api/projects/{id}/comments
- POST /api/projects/{id}/bookmark
- GET /api/bookmarks
- GET /api/bookmarks/ids
- GET /api/votes/ids
- DELETE /api/projects/{id}

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/ProjectService.java backend/src/main/java/com/innovationlab/controller/ProjectController.java && git commit -m "feat: add project service and controller with full CRUD"
```

---

### Task 16: Create Reference Data Controllers

**Files:**
- Create: `backend/src/main/java/com/innovationlab/controller/ReferenceController.java`

- [ ] **Step 1: Write `ReferenceController.java`**

Endpoints:
- GET /api/categories → list all categories
- GET /api/tracks → list all tracks
- GET /api/audiences → list all audiences
- GET /api/sponsors → list all sponsors
- GET /api/faq → list all FAQs
- GET /api/blog → list all blog posts
- GET /api/blog/{id} → single blog post

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/innovationlab/controller/ReferenceController.java && git commit -m "feat: add reference data controller (categories, tracks, sponsors, blog, faq)"
```

---

### Task 17: Create Stats, Leaderboard, and Search Controllers

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/StatsService.java`
- Create: `backend/src/main/java/com/innovationlab/controller/StatsController.java`
- Create: `backend/src/main/java/com/innovationlab/controller/SearchController.java`

- [ ] **Step 1: Write stats/leaderboard/hall-of-fame/search endpoints**

```
GET /api/stats → total projects, votes, participants, institutions, current round
GET /api/leaderboard?period=all|month|week|today → top 20 projects by period
GET /api/hall-of-fame → project of the day/week/month
GET /api/search?q= → search projects by name, tagline, description, tech stack, institution
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/innovationlab/ && git commit -m "feat: add stats, leaderboard, hall-of-fame, and search controllers"
```

---

### Task 18: Create Admin Controller

**Files:**
- Create: `backend/src/main/java/com/innovationlab/controller/AdminController.java`

- [ ] **Step 1: Write `AdminController.java`**

```
GET /api/admin/dashboard → aggregate stats
GET /api/admin/users → paginated user list
PUT /api/admin/users/{id}/toggle-admin → toggle admin status
GET /api/admin/projects → paginated project list
PUT /api/admin/projects/{id}/feature → toggle featured
DELETE /api/admin/projects/{id} → admin delete
POST /api/admin/blog → create blog post
PUT /api/admin/blog/{id} → update blog post
DELETE /api/admin/blog/{id} → delete blog post
POST /api/admin/sponsors → create sponsor
PUT /api/admin/sponsors/{id} → update sponsor
DELETE /api/admin/sponsors/{id} → delete sponsor
POST /api/admin/make-admin → first-user admin
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/innovationlab/controller/AdminController.java && git commit -m "feat: add admin controller for user, project, blog, and sponsor management"
```

---

### Task 19: Create Seed Data Service and Controller

**Files:**
- Create: `backend/src/main/java/com/innovationlab/service/SeedService.java`
- Create: `backend/src/main/java/com/innovationlab/controller/SeedController.java`

- [ ] **Step 1: Write `SeedService.java`**

Seed the database with initial data from Python `seed.py`:
- 10 categories
- 6 tracks
- 6 audiences
- 6 sponsors
- 6 FAQ items
- 4 blog posts
- 18 projects

Same data, same IDs for categories/tracks mapping in projects.

- [ ] **Step 2: Write `SeedController.java`**

```
POST /api/seed → clear all data and re-seed
GET /api/ → health check: {"message": "Innovation Lab API", "status": "running"}
GET /api/health → health check
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/java/com/innovationlab/service/SeedService.java backend/src/main/java/com/innovationlab/controller/SeedController.java && git commit -m "feat: add seed service and controller with 18 projects"
```

---

### Task 20: Add Global Exception Handler

**Files:**
- Create: `backend/src/main/java/com/innovationlab/config/GlobalExceptionHandler.java`

- [ ] **Step 1: Write exception handler mapping runtime exceptions to HTTP status codes**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handle(RuntimeException e) {
        String msg = e.getMessage();
        int status = msg.contains("not found") ? 404 :
                     msg.contains("Invalid email") || msg.contains("Not authenticated") || msg.contains("Invalid token") ? 401 :
                     msg.contains("already registered") || msg.contains("Admin already exists") ? 400 :
                     msg.contains("Not authorized") || msg.contains("Admin access") ? 403 : 500;
        return ResponseEntity.status(status).body(Map.of("detail", msg));
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/innovationlab/config/GlobalExceptionHandler.java && git commit -m "feat: add global exception handler"
```

---

### Task 21: Create .env.example for Backend

**Files:**
- Create: `backend/.env.example`

- [ ] **Step 1: Write `backend/.env.example`**

```
DATASOURCE_URL=jdbc:postgresql://localhost:5432/innovationlab
DATASOURCE_USER=innovationlab
DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your-256-bit-secret-key-here-change-in-production
ALLOWED_ORIGINS=http://localhost:3000
```

- [ ] **Step 2: Commit**

```bash
git add backend/.env.example && git commit -m "feat: add backend .env.example"
```

---

### Task 22: Create PostgreSQL Setup Script

**Files:**
- Create: `database/setup.sql`

- [ ] **Step 1: Write `database/setup.sql`**

```sql
-- Innovation Lab Database Setup
-- Run this in DBeaver CE or pgAdmin4

CREATE DATABASE innovationlab;
CREATE USER innovationlab WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE innovationlab TO innovationlab;
\c innovationlab
GRANT ALL ON SCHEMA public TO innovationlab;
```

- [ ] **Step 2: Commit**

```bash
git add database/setup.sql && git commit -m "docs: add PostgreSQL database setup script"
```

---

### Task 23: Write README

**Files:**
- Overwrite: `README.md`

- [ ] **Step 1: Write comprehensive README**

```markdown
# Innovation Lab

South Africa's premier innovation competition platform. Build, compete, and collaborate with developers across the country.

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, shadcn/ui
- **Backend:** Java 21, Spring Boot 3.4, PostgreSQL
- **Auth:** JWT (jjwt) + BCrypt
- **Build:** Maven (backend), npm/CRA (frontend)

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 16+
- DBeaver CE or pgAdmin4 (optional, for DB management)

## Setup

### 1. Database

Create the database using DBeaver CE or pgAdmin4:

```sql
CREATE DATABASE innovationlab;
CREATE USER innovationlab WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE innovationlab TO innovationlab;
```

Or use the script: `psql -U postgres -f database/setup.sql`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret
mvn spring-boot:run
```

The API will be available at http://localhost:8080

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with REACT_APP_BACKEND_URL=http://localhost:8080
npm install
npm start
```

The app will be available at http://localhost:3000

## API Overview

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/auth/me | Yes |
| GET | /api/projects | No |
| POST | /api/projects | Yes |
| GET | /api/leaderboard | No |
| GET | /api/stats | No |
| GET | /api/categories | No |
| GET | /api/blog | No |
| POST | /api/seed | No |

Full API docs: see `contracts.md`

## Project Structure

```
Innovation Lab/
  backend/          Spring Boot API
  frontend/         React SPA
  database/         SQL setup scripts
  contracts.md      API contracts
```

## Environment Variables

### Backend
- `DATASOURCE_URL` — PostgreSQL JDBC URL
- `DATASOURCE_USER` — Database username
- `DATASOURCE_PASSWORD` — Database password
- `JWT_SECRET` — JWT signing secret (256-bit)
- `ALLOWED_ORIGINS` — Comma-separated CORS origins

### Frontend
- `REACT_APP_BACKEND_URL` — Backend API URL
- `REACT_APP_POSTHOG_KEY` — PostHog analytics key
```

- [ ] **Step 2: Commit**

```bash
git add README.md && git commit -m "docs: write comprehensive README"
```

---

### Task 24: Verify Frontend Build

- [ ] **Step 1: Install dependencies and build frontend**

```bash
cd frontend && npm install && npm run build
```
Expected: Build succeeds with no errors

- [ ] **Step 2: Note any issues, fix and recommit**

---

### Task 25: Verify Backend Compiles

- [ ] **Step 1: Compile backend**

```bash
cd backend && mvn clean compile
```
Expected: BUILD SUCCESS

- [ ] **Step 2: Package backend**

```bash
cd backend && mvn package -DskipTests
```
Expected: BUILD SUCCESS, jar in target/

---

### Task 26: Update contracts.md

**Files:**
- Modify: `contracts.md`

- [ ] **Step 1: Update project name references in contracts.md**

Replace "VibePush SA" → "Innovation Lab", update database section to reference PostgreSQL instead of MongoDB.

- [ ] **Step 2: Commit**

```bash
git add contracts.md && git commit -m "docs: update contracts.md for Innovation Lab"
```

---

### Task 27: Remove Python Backend

**Files:**
- Delete: `backend/` (Python backend directory)
- Delete: `tests/` directory
- Delete: `backend_test.py`
- Delete: `backend_admin_test.py`

- [ ] **Step 1: Delete Python backend and test files**

```bash
rm -rf backend/ tests/ backend_test.py backend_admin_test.py
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "chore: remove Python backend — replaced by Java/Spring Boot"
```

---

### Task 28: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add Java-specific ignores**

Append to `.gitignore`:
```
# Java
target/
*.class
*.jar
*.war

# PostgreSQL data
data/

# Environment
.env
.env.*
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore && git commit -m "chore: update .gitignore for Java and PostgreSQL"
```

---

### Task 29: Final Verification

- [ ] **Step 1: Verify frontend builds fresh**

```bash
cd frontend && npm run build
```

- [ ] **Step 2: Verify backend compiles fresh**

```bash
cd backend && mvn clean package -DskipTests
```

- [ ] **Step 3: Verify no remaining Emergent references**

```bash
rg -i "emergent" --type-not json --type-not lock 2>/dev/null || echo "No emergent references found"
```

- [ ] **Step 4: Verify no remaining "VibePush" references (except in git history)**

```bash
rg -i "vibepush" --type-not json --type-not lock 2>/dev/null || echo "No vibepush references found"
```

- [ ] **Step 5: Commit if any remaining cleanup needed**

```bash
git add -A && git commit -m "chore: final cleanup and verification"
```
