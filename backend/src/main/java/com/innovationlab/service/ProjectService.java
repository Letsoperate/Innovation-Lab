package com.innovationlab.service;

import com.innovationlab.model.dto.*;
import com.innovationlab.model.entity.*;
import com.innovationlab.repository.*;
import com.innovationlab.util.SanitizeUtil;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.*;

@Service
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final VoteRepository voteRepo;
    private final CommentRepository commentRepo;
    private final BookmarkRepository bookmarkRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    public ProjectService(ProjectRepository projectRepo, VoteRepository voteRepo,
                          CommentRepository commentRepo, BookmarkRepository bookmarkRepo,
                          UserRepository userRepo, NotificationService notificationService) {
        this.projectRepo = projectRepo;
        this.voteRepo = voteRepo;
        this.commentRepo = commentRepo;
        this.bookmarkRepo = bookmarkRepo;
        this.userRepo = userRepo;
        this.notificationService = notificationService;
    }

    public Map<String, Object> listProjects(String tab, String period, String category,
                                            String track, String search, int page, int limit) {
        List<Project> all = projectRepo.findAll();

        Instant periodStart = getPeriodStart(period);
        Instant periodEnd = getPeriodEnd(period);

        Stream<Project> stream = all.stream();

        if (periodStart != null) {
            if (periodEnd != null) {
                stream = stream.filter(p -> !p.getCreatedAt().isBefore(periodStart) && p.getCreatedAt().isBefore(periodEnd));
            } else {
                stream = stream.filter(p -> !p.getCreatedAt().isBefore(periodStart));
            }
        }

        if (category != null && !category.isBlank()) {
            stream = stream.filter(p -> category.equalsIgnoreCase(p.getCategory()));
        }

        if (track != null && !track.isBlank()) {
            stream = stream.filter(p -> track.equalsIgnoreCase(p.getTrack()));
        }

        if (search != null && !search.isBlank()) {
            stream = stream.filter(p -> matchesSearch(p, search));
        }

        List<Project> filtered = stream.collect(Collectors.toList());

        String t = tab != null ? tab : "recent";
        switch (t) {
            case "top" -> filtered.sort((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()));
            case "live" -> filtered.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
            case "recent" -> filtered.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
            case "updated" -> filtered.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));
        }

        long total = filtered.size();
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, filtered.size());
        List<Project> pageContent = start < filtered.size() ? filtered.subList(start, end) : List.of();

        List<ProjectResponse> responses = pageContent.stream().map(this::toResponse).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("projects", responses);
        result.put("total", total);
        return result;
    }

    public Map<String, List<ProjectResponse>> getGroupedProjects() {
        List<Project> all = projectRepo.findAll();
        Map<String, List<ProjectResponse>> result = new LinkedHashMap<>();

        String[] periods = {"today", "yesterday", "week", "month", "all"};
        for (String period : periods) {
            if ("all".equals(period)) {
                List<ProjectResponse> allTime = all.stream()
                        .filter(p -> p.getCreatedAt().isBefore(getPeriodStart("month")))
                        .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
                        .limit(50)
                        .map(this::toResponse)
                        .collect(Collectors.toList());
                if (!allTime.isEmpty()) result.put("all", allTime);
                continue;
            }
            Instant start = getPeriodStart(period);
            Instant end = getPeriodEnd(period);
            Stream<Project> stream = all.stream().filter(p -> !p.getCreatedAt().isBefore(start));
            if (end != null) {
                stream = stream.filter(p -> p.getCreatedAt().isBefore(end));
            }
            List<ProjectResponse> top = stream
                    .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
                    .limit(50)
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            result.put(period, top);
        }
        return result;
    }

    public ProjectResponse getProject(String id) {
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setViews(project.getViews() + 1);
        projectRepo.save(project);
        return toResponse(project);
    }

    public ProjectResponse getProjectBySlug(String slug) {
        Project project = projectRepo.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setViews(project.getViews() + 1);
        projectRepo.save(project);
        return toResponse(project);
    }

    public ProjectResponse createProject(ProjectRequest req, String userId, String userName) {
        Project project = new Project();
        project.setName(SanitizeUtil.sanitize(req.getName()));
        project.setTagline(SanitizeUtil.sanitize(req.getTagline()));
        project.setDescription(SanitizeUtil.sanitize(req.getDescription()));
        project.setDemoUrl(req.getDemoUrl());
        project.setRepoUrl(req.getRepoUrl());
        project.setVideoUrl(req.getVideoUrl());
        project.setCategory(req.getCategory());
        project.setTrack(req.getTrack());
        project.setInstitution(SanitizeUtil.sanitize(req.getInstitution()));
        project.setTeamName(SanitizeUtil.sanitize(req.getTeamName()));
        project.setTeamSize(req.getTeamSize());
        project.setTechStack(SanitizeUtil.sanitize(req.getTechStack()));
        project.setLogoColor(req.getLogoColor() != null ? req.getLogoColor() : "#009639");
        project.setLogoInitial(req.getLogoInitial());
        project.setUserId(userId);
        project.setUserName(userName);
        projectRepo.save(project);
        return toResponse(project);
    }

    public ProjectResponse updateProject(String id, ProjectRequest req, String userId, boolean isAdmin) {
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!isAdmin && !project.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this project");
        }
        if (req.getName() != null) project.setName(SanitizeUtil.sanitize(req.getName()));
        if (req.getTagline() != null) project.setTagline(SanitizeUtil.sanitize(req.getTagline()));
        if (req.getDescription() != null) project.setDescription(SanitizeUtil.sanitize(req.getDescription()));
        if (req.getDemoUrl() != null) project.setDemoUrl(req.getDemoUrl());
        if (req.getRepoUrl() != null) project.setRepoUrl(req.getRepoUrl());
        if (req.getVideoUrl() != null) project.setVideoUrl(req.getVideoUrl());
        if (req.getCategory() != null) project.setCategory(req.getCategory());
        if (req.getTrack() != null) project.setTrack(req.getTrack());
        if (req.getInstitution() != null) project.setInstitution(SanitizeUtil.sanitize(req.getInstitution()));
        if (req.getTeamName() != null) project.setTeamName(SanitizeUtil.sanitize(req.getTeamName()));
        project.setTeamSize(req.getTeamSize());
        if (req.getTechStack() != null) project.setTechStack(SanitizeUtil.sanitize(req.getTechStack()));
        if (req.getLogoColor() != null) project.setLogoColor(req.getLogoColor());
        if (req.getLogoInitial() != null) project.setLogoInitial(req.getLogoInitial());
        project.setUpdatedAt(Instant.now());
        projectRepo.save(project);
        return toResponse(project);
    }

    public VoteResponse toggleVote(String projectId, String userId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Optional<Vote> existing = voteRepo.findByProjectIdAndUserId(projectId, userId);
        if (existing.isPresent()) {
            voteRepo.delete(existing.get());
            project.setUpvotes(Math.max(0, project.getUpvotes() - 1));
            projectRepo.save(project);
            return new VoteResponse(false, project.getUpvotes());
        } else {
            Vote vote = new Vote(projectId, userId);
            voteRepo.save(vote);
            project.setUpvotes(project.getUpvotes() + 1);
            projectRepo.save(project);
            // Notify project owner (don't notify if voting on own project)
            if (!project.getUserId().equals(userId)) {
                User voter = userRepo.findById(userId).orElse(null);
                notificationService.createNotification(
                    project.getUserId(),
                    "VOTE",
                    (voter != null ? voter.getName() : "Someone") + " voted on " + project.getName(),
                    "/project/" + project.getId()
                );
            }
            return new VoteResponse(true, project.getUpvotes());
        }
    }

    public boolean voteStatus(String projectId, String userId) {
        if (userId == null) return false;
        return voteRepo.findByProjectIdAndUserId(projectId, userId).isPresent();
    }

    public List<CommentResponse> getComments(String projectId) {
        List<Comment> comments = commentRepo.findByProjectIdOrderByCreatedAtDesc(projectId);
        return comments.stream().map(c -> {
            CommentResponse r = new CommentResponse();
            r.setId(c.getId());
            r.setProjectId(c.getProjectId());
            r.setUserId(c.getUserId());
            r.setUserName(c.getUserName());
            r.setText(c.getText());
            r.setCreatedAt(c.getCreatedAt());
            return r;
        }).collect(Collectors.toList());
    }

    public CommentResponse addComment(String projectId, CommentRequest req, String userId, String userName) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Comment comment = new Comment(projectId, userId, userName, req.getText());
        commentRepo.save(comment);
        project.setCommentsCount(project.getCommentsCount() + 1);
        projectRepo.save(project);
        // Notify project owner
        if (!project.getUserId().equals(userId)) {
            notificationService.createNotification(
                project.getUserId(),
                "COMMENT",
                userName + " commented on " + project.getName(),
                "/project/" + project.getId()
            );
        }
        CommentResponse r = new CommentResponse();
        r.setId(comment.getId());
        r.setProjectId(comment.getProjectId());
        r.setUserId(comment.getUserId());
        r.setUserName(comment.getUserName());
        r.setText(comment.getText());
        r.setCreatedAt(comment.getCreatedAt());
        return r;
    }

    public BookmarkResponse toggleBookmark(String projectId, String userId) {
        Optional<Bookmark> existing = bookmarkRepo.findByProjectIdAndUserId(projectId, userId);
        if (existing.isPresent()) {
            bookmarkRepo.delete(existing.get());
            return new BookmarkResponse(false);
        } else {
            Bookmark bookmark = new Bookmark(projectId, userId);
            bookmarkRepo.save(bookmark);
            // Notify project owner
            Project project = projectRepo.findById(projectId).orElse(null);
            if (project != null && !project.getUserId().equals(userId)) {
                User bookmarker = userRepo.findById(userId).orElse(null);
                notificationService.createNotification(
                    project.getUserId(),
                    "BOOKMARK",
                    (bookmarker != null ? bookmarker.getName() : "Someone") + " saved " + project.getName(),
                    "/project/" + project.getId()
                );
            }
            return new BookmarkResponse(true);
        }
    }

    public Map<String, Object> getBookmarks(String userId) {
        List<Bookmark> bookmarks = bookmarkRepo.findByUserId(userId);
        List<ProjectResponse> projects = bookmarks.stream()
                .map(b -> projectRepo.findById(b.getProjectId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(this::toResponse)
                .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("projects", projects);
        return result;
    }

    public IdListResponse getBookmarkIds(String userId) {
        List<String> ids = bookmarkRepo.findByUserId(userId).stream()
                .map(Bookmark::getProjectId)
                .collect(Collectors.toList());
        return new IdListResponse(ids);
    }

    public IdListResponse getVoteIds(String userId) {
        List<String> ids = voteRepo.findByUserId(userId).stream()
                .map(Vote::getProjectId)
                .collect(Collectors.toList());
        return new IdListResponse(ids);
    }

    public List<ProjectResponse> getUserProjects(String userId) {
        return projectRepo.findByUserId(userId, Pageable.unpaged()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> listFollowingProjects(String userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        List<Project> projects = projectRepo.findProjectsFromFollowedUsers(userId, pageable);
        long total = projectRepo.countProjectsFromFollowedUsers(userId);
        List<ProjectResponse> responses = projects.stream().map(this::toResponse).collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("projects", responses);
        result.put("total", total);
        return result;
    }

    public void deleteProject(String id, String userId, boolean isAdmin) {
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!isAdmin && !project.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this project");
        }
        voteRepo.deleteByProjectId(id);
        commentRepo.deleteByProjectId(id);
        bookmarkRepo.deleteByProjectId(id);
        projectRepo.delete(project);
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

    private Instant getPeriodStart(String period) {
        LocalDate today = LocalDate.now();
        return switch (period != null ? period : "") {
            case "today" -> today.atStartOfDay(ZoneOffset.UTC).toInstant();
            case "yesterday" -> today.minusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            case "week" -> today.minusDays(7).atStartOfDay(ZoneOffset.UTC).toInstant();
            case "month" -> today.minusDays(30).atStartOfDay(ZoneOffset.UTC).toInstant();
            default -> null;
        };
    }

    private Instant getPeriodEnd(String period) {
        if ("yesterday".equals(period)) {
            return LocalDate.now().atStartOfDay(ZoneOffset.UTC).toInstant();
        }
        return null;
    }

    private boolean matchesSearch(Project p, String search) {
        if (search == null || search.isBlank()) return true;
        String lower = search.toLowerCase();
        return (p.getName() != null && p.getName().toLowerCase().contains(lower))
            || (p.getTagline() != null && p.getTagline().toLowerCase().contains(lower))
            || (p.getDescription() != null && p.getDescription().toLowerCase().contains(lower))
            || (p.getTechStack() != null && p.getTechStack().toLowerCase().contains(lower))
            || (p.getInstitution() != null && p.getInstitution().toLowerCase().contains(lower));
    }
}
