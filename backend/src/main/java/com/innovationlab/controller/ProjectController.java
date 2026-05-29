package com.innovationlab.controller;

import com.innovationlab.model.dto.*;
import com.innovationlab.security.JwtProvider;
import com.innovationlab.service.ProjectService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ProjectController {

    private final ProjectService projectService;
    private final JwtProvider jwtProvider;

    public ProjectController(ProjectService projectService, JwtProvider jwtProvider) {
        this.projectService = projectService;
        this.jwtProvider = jwtProvider;
    }

    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> listProjects(
            @RequestParam(defaultValue = "recent") String tab,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String track,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(projectService.listProjects(tab, period, category, track, search, page, limit));
    }

    @GetMapping("/projects/grouped")
    public ResponseEntity<Map<String, List<ProjectResponse>>> getGroupedProjects() {
        return ResponseEntity.ok(projectService.getGroupedProjects());
    }

    @GetMapping("/projects/slug/{slug}")
    public ResponseEntity<ProjectResponse> getProjectBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(projectService.getProjectBySlug(slug));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectResponse> createProject(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody ProjectRequest req) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        String userName = extractClaim(auth, "name");
        return ResponseEntity.ok(projectService.createProject(req, userId, userName != null ? userName : "Unknown"));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @RequestBody ProjectRequest req) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(projectService.updateProject(id, req, userId, isAdmin));
    }

    @PostMapping("/projects/{id}/vote")
    public ResponseEntity<VoteResponse> toggleVote(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(projectService.toggleVote(id, userId));
    }

    @GetMapping("/projects/{id}/vote-status")
    public ResponseEntity<Map<String, Boolean>> voteStatus(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        String userId = extractUserId(auth);
        Map<String, Boolean> result = new HashMap<>();
        result.put("voted", projectService.voteStatus(id, userId));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/projects/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getComments(id));
    }

    @PostMapping("/projects/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @RequestBody CommentRequest req) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        String userName = extractClaim(auth, "name");
        return ResponseEntity.ok(projectService.addComment(id, req, userId, userName != null ? userName : "Unknown"));
    }

    @PostMapping("/projects/{id}/bookmark")
    public ResponseEntity<BookmarkResponse> toggleBookmark(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(projectService.toggleBookmark(id, userId));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<Map<String, Object>> getBookmarks(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.ok(Map.of("projects", List.of()));
        return ResponseEntity.ok(projectService.getBookmarks(userId));
    }

    @GetMapping("/bookmarks/ids")
    public ResponseEntity<IdListResponse> getBookmarkIds(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.ok(new IdListResponse(List.of()));
        return ResponseEntity.ok(projectService.getBookmarkIds(userId));
    }

    @GetMapping("/votes/ids")
    public ResponseEntity<IdListResponse> getVoteIds(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.ok(new IdListResponse(List.of()));
        return ResponseEntity.ok(projectService.getVoteIds(userId));
    }

    @GetMapping("/users/me/projects")
    public ResponseEntity<List<ProjectResponse>> getUserProjects(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(projectService.getUserProjects(userId));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        boolean isAdmin = isAdmin(auth);
        projectService.deleteProject(id, userId, isAdmin);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Project deleted");
        return ResponseEntity.ok(result);
    }

    private String extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        Claims claims = jwtProvider.validateToken(authHeader.substring(7));
        return claims != null ? claims.get("sub", String.class) : null;
    }

    private String extractClaim(String authHeader, String key) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        Claims claims = jwtProvider.validateToken(authHeader.substring(7));
        return claims != null ? claims.get(key, String.class) : null;
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        Claims claims = jwtProvider.validateToken(authHeader.substring(7));
        return claims != null && Boolean.TRUE.equals(claims.get("is_admin", Boolean.class));
    }
}
