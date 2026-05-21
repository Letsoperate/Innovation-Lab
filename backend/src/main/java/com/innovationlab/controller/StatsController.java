package com.innovationlab.controller;

import com.innovationlab.model.dto.*;
import com.innovationlab.model.entity.Project;
import com.innovationlab.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;
import java.util.stream.*;

@RestController
@RequestMapping("/api")
public class StatsController {

    private final ProjectRepository projectRepo;
    private final VoteRepository voteRepo;
    private final UserRepository userRepo;

    public StatsController(ProjectRepository projectRepo, VoteRepository voteRepo, UserRepository userRepo) {
        this.projectRepo = projectRepo;
        this.voteRepo = voteRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        List<Project> projects = projectRepo.findAll();
        int totalProjects = projects.size();
        int totalVotes = projects.stream().mapToInt(Project::getUpvotes).sum();
        int totalParticipants = (int) userRepo.count();
        int totalInstitutions = (int) projects.stream()
                .map(Project::getInstitution)
                .filter(i -> i != null && !i.isBlank())
                .distinct()
                .count();
        return ResponseEntity.ok(new StatsResponse(totalProjects, totalVotes, totalParticipants, totalInstitutions));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<Map<String, Object>> getLeaderboard(
            @RequestParam(defaultValue = "all") String period) {
        List<Project> all = projectRepo.findAll();
        Instant start = getPeriodStart(period);
        Instant end = getPeriodEnd(period);

        Stream<Project> stream = all.stream();
        if (start != null) {
            if (end != null) {
                stream = stream.filter(p -> !p.getCreatedAt().isBefore(start) && p.getCreatedAt().isBefore(end));
            } else {
                stream = stream.filter(p -> !p.getCreatedAt().isBefore(start));
            }
        }

        List<ProjectResponse> top = stream
                .sorted((a, b) -> Integer.compare(b.getInnovationScore(), a.getInnovationScore()))
                .limit(20)
                .map(this::toResponse)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("projects", top);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/hall-of-fame")
    public ResponseEntity<Map<String, Object>> getHallOfFame() {
        List<Project> sorted = projectRepo.findAll().stream()
                .filter(p -> p.getUpvotes() > 0)
                .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
                .limit(10)
                .collect(Collectors.toList());

        List<HallOfFameItem> items = new ArrayList<>();
        String[] awards = {"Project of the Year", "Most Innovative", "Community Choice", "Best Design", "Top Tech Stack",
                "People's Choice", "Rising Star", "Best Newcomer", "Judges Pick", "Innovation Award"};
        for (int i = 0; i < sorted.size(); i++) {
            Project p = sorted.get(i);
            items.add(new HallOfFameItem(
                    p.getName(),
                    i < awards.length ? awards[i] : "Honorable Mention",
                    p.getLogoColor(),
                    p.getLogoInitial(),
                    p.getLogoImage(),
                    p.getCreatedAt().toString().substring(0, 10)
            ));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q) {
        String lower = q.toLowerCase();
        List<ProjectResponse> results = projectRepo.findAll().stream()
                .filter(p -> matchesSearch(p, lower))
                .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
                .limit(10)
                .map(this::toResponse)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("projects", results);
        return ResponseEntity.ok(result);
    }

    private Instant getPeriodStart(String period) {
        LocalDate today = LocalDate.now();
        return switch (period != null ? period : "") {
            case "today" -> today.atStartOfDay(ZoneOffset.UTC).toInstant();
            case "week" -> today.minusDays(7).atStartOfDay(ZoneOffset.UTC).toInstant();
            case "month" -> today.minusDays(30).atStartOfDay(ZoneOffset.UTC).toInstant();
            default -> null;
        };
    }

    private Instant getPeriodEnd(String period) {
        return null;
    }

    private boolean matchesSearch(Project p, String lower) {
        return (p.getName() != null && p.getName().toLowerCase().contains(lower))
            || (p.getTagline() != null && p.getTagline().toLowerCase().contains(lower))
            || (p.getDescription() != null && p.getDescription().toLowerCase().contains(lower))
            || (p.getTechStack() != null && p.getTechStack().toLowerCase().contains(lower))
            || (p.getInstitution() != null && p.getInstitution().toLowerCase().contains(lower));
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
}
