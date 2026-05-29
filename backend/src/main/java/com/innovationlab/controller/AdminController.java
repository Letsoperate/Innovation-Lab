package com.innovationlab.controller;

import com.innovationlab.model.dto.*;
import com.innovationlab.model.entity.*;
import com.innovationlab.repository.*;
import com.innovationlab.security.JwtProvider;
import io.jsonwebtoken.Claims;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;
import java.util.stream.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final VoteRepository voteRepo;
    private final CommentRepository commentRepo;
    private final BookmarkRepository bookmarkRepo;
    private final BlogPostRepository blogPostRepo;
    private final SponsorRepository sponsorRepo;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public AdminController(ProjectRepository projectRepo, UserRepository userRepo,
                           VoteRepository voteRepo, CommentRepository commentRepo,
                           BookmarkRepository bookmarkRepo, BlogPostRepository blogPostRepo,
                           SponsorRepository sponsorRepo, JwtProvider jwtProvider,
                           PasswordEncoder passwordEncoder) {
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
        this.voteRepo = voteRepo;
        this.commentRepo = commentRepo;
        this.bookmarkRepo = bookmarkRepo;
        this.blogPostRepo = blogPostRepo;
        this.sponsorRepo = sponsorRepo;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        requireAdmin(auth);
        AdminDashboardResponse res = new AdminDashboardResponse();
        res.setTotalProjects((int) projectRepo.count());
        res.setTotalUsers((int) userRepo.count());
        res.setTotalVotes((int) voteRepo.count());
        res.setTotalComments((int) commentRepo.count());
        res.setTotalBookmarks((int) bookmarkRepo.count());

        Instant todayStart = LocalDate.now().atStartOfDay(ZoneOffset.UTC).toInstant();
        res.setProjectsToday((int) projectRepo.countByCreatedAtAfter(todayStart));
        res.setVotesToday((int) voteRepo.countByCreatedAtAfter(todayStart));
        res.setUsersToday((int) userRepo.countByCreatedAtAfter(todayStart));

        List<Map<String, Object>> topCategories = projectRepo.findAll().stream()
                .filter(p -> p.getCategory() != null && !p.getCategory().isBlank())
                .collect(Collectors.groupingBy(Project::getCategory, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
        res.setTopCategories(topCategories);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        requireAdmin(auth);
        List<Map<String, Object>> users = userRepo.findAll().stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("institution", u.getInstitution());
            m.put("is_admin", u.isAdmin());
            m.put("avatar_url", u.getAvatarUrl());
            m.put("project_count", projectRepo.countByUserId(u.getId()));
            return m;
        }).collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/users/{id}/toggle-admin")
    public ResponseEntity<Map<String, Object>> toggleAdmin(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        requireAdmin(auth);
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAdmin(!user.isAdmin());
        userRepo.save(user);
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("is_admin", user.isAdmin());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> getProjects(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        requireAdmin(auth);
        List<ProjectResponse> projects = projectRepo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("projects", projects);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/projects/{id}/feature")
    public ResponseEntity<ProjectResponse> featureProject(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        requireAdmin(auth);
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setFeatured(!project.isFeatured());
        projectRepo.save(project);
        return ResponseEntity.ok(toResponse(project));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        requireAdmin(auth);
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        voteRepo.deleteByProjectId(id);
        commentRepo.deleteByProjectId(id);
        bookmarkRepo.deleteByProjectId(id);
        projectRepo.delete(project);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Project deleted");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/blog")
    public ResponseEntity<BlogPostResponse> createBlogPost(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody BlogPostRequest req) {
        requireAdmin(auth);
        BlogPost post = new BlogPost(req.getTitle(), req.getExcerpt(), req.getContent(),
                req.getDate(), req.getCategory(), req.getReadTime());
        blogPostRepo.save(post);
        return ResponseEntity.ok(toBlogResponse(post));
    }

    @PutMapping("/blog/{id}")
    public ResponseEntity<BlogPostResponse> updateBlogPost(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @RequestBody BlogPostRequest req) {
        requireAdmin(auth);
        BlogPost post = blogPostRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        if (req.getTitle() != null) post.setTitle(req.getTitle());
        if (req.getExcerpt() != null) post.setExcerpt(req.getExcerpt());
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getDate() != null) post.setDate(req.getDate());
        if (req.getCategory() != null) post.setCategory(req.getCategory());
        if (req.getReadTime() != null) post.setReadTime(req.getReadTime());
        blogPostRepo.save(post);
        return ResponseEntity.ok(toBlogResponse(post));
    }

    @DeleteMapping("/blog/{id}")
    public ResponseEntity<Map<String, String>> deleteBlogPost(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        requireAdmin(auth);
        blogPostRepo.deleteById(id);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Blog post deleted");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sponsors")
    public ResponseEntity<SponsorResponse> createSponsor(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody SponsorRequest req) {
        requireAdmin(auth);
        Sponsor sponsor = new Sponsor(req.getName(), req.getDescription(), req.getLogo(),
                req.getColor() != null ? req.getColor() : "#009639",
                req.getTextColor() != null ? req.getTextColor() : "#ffffff");
        if (req.getEmail() != null) sponsor.setEmail(req.getEmail());
        if (req.getPassword() != null) sponsor.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        sponsorRepo.save(sponsor);
        return ResponseEntity.ok(new SponsorResponse(sponsor.getId(), sponsor.getName(),
                sponsor.getDescription(), sponsor.getLogo(), sponsor.getColor(), sponsor.getTextColor()));
    }

    @PutMapping("/sponsors/{id}")
    public ResponseEntity<SponsorResponse> updateSponsor(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @RequestBody SponsorRequest req) {
        requireAdmin(auth);
        Sponsor sponsor = sponsorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sponsor not found"));
        if (req.getName() != null) sponsor.setName(req.getName());
        if (req.getDescription() != null) sponsor.setDescription(req.getDescription());
        if (req.getLogo() != null) sponsor.setLogo(req.getLogo());
        if (req.getColor() != null) sponsor.setColor(req.getColor());
        if (req.getTextColor() != null) sponsor.setTextColor(req.getTextColor());
        sponsorRepo.save(sponsor);
        return ResponseEntity.ok(new SponsorResponse(sponsor.getId(), sponsor.getName(),
                sponsor.getDescription(), sponsor.getLogo(), sponsor.getColor(), sponsor.getTextColor()));
    }

    @DeleteMapping("/sponsors/{id}")
    public ResponseEntity<Map<String, String>> deleteSponsor(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        requireAdmin(auth);
        sponsorRepo.deleteById(id);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Sponsor deleted");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/make-admin")
    public ResponseEntity<Map<String, String>> makeAdmin(
            @RequestBody Map<String, String> body) {
        if (userRepo.existsByIsAdminTrue()) {
            throw new RuntimeException("Admin already exists");
        }
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Invalid email");
        }
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAdmin(true);
        userRepo.save(user);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Admin created");
        return ResponseEntity.ok(result);
    }

    private void requireAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Not authenticated");
        }
        Claims claims = jwtProvider.validateToken(authHeader.substring(7));
        if (claims == null) {
            throw new RuntimeException("Not authenticated");
        }
        String userId = claims.get("sub", String.class);
        if (userId == null) {
            throw new RuntimeException("Not authenticated");
        }
        User user = userRepo.findById(userId).orElse(null);
        if (user == null || !user.isAdmin()) {
            throw new RuntimeException("Admin access required");
        }
    }

    private ProjectResponse toResponse(Project p) {
        ProjectResponse r = new ProjectResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setTagline(p.getTagline());
        r.setDescription(p.getDescription());
        r.setDemoUrl(p.getDemoUrl());
        r.setRepoUrl(p.getRepoUrl());
        r.setVideoUrl(p.getVideoUrl());
        r.setCategory(p.getCategory());
        r.setTrack(p.getTrack());
        r.setInstitution(p.getInstitution());
        r.setTeamName(p.getTeamName());
        r.setTeamSize(p.getTeamSize());
        r.setTechStack(p.getTechStack());
        r.setLogoColor(p.getLogoColor());
        r.setLogoInitial(p.getLogoInitial());
        r.setLogoImage(p.getLogoImage());
        r.setCategories(p.getCategory() != null && !p.getCategory().isBlank()
                ? List.of(p.getCategory()) : List.of());
        r.setUpvotes(p.getUpvotes());
        r.setViews(p.getViews());
        r.setCommentsCount(p.getCommentsCount());
        r.setRating(p.getRating());
        r.setInnovationScore(p.getInnovationScore());
        r.setIsTrending(p.isTrending());
        r.setHasVideo(p.isHasVideo());
        r.setRank(p.getRank());
        r.setRankLabel(p.getRankLabel());
        r.setUserId(p.getUserId());
        r.setUserName(p.getUserName());
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }

    private BlogPostResponse toBlogResponse(BlogPost p) {
        BlogPostResponse r = new BlogPostResponse();
        r.setId(p.getId());
        r.setTitle(p.getTitle());
        r.setExcerpt(p.getExcerpt());
        r.setContent(p.getContent());
        r.setDate(p.getDate());
        r.setCategory(p.getCategory());
        r.setReadTime(p.getReadTime());
        return r;
    }
}
