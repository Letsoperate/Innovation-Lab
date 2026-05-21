package com.innovationlab.controller;

import com.innovationlab.model.entity.*;
import com.innovationlab.repository.*;
import com.innovationlab.security.JwtProvider;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class SocialController {
    private final FollowRepository followRepo;
    private final UserRepository userRepo;
    private final JwtProvider jwtProvider;

    public SocialController(FollowRepository followRepo, UserRepository userRepo, JwtProvider jwtProvider) {
        this.followRepo = followRepo;
        this.userRepo = userRepo;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/users/{id}/follow")
    public ResponseEntity<Map<String, Object>> toggleFollow(
            @RequestHeader("Authorization") String auth, @PathVariable String id) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        if (userId.equals(id)) return ResponseEntity.badRequest().build();

        var existing = followRepo.findByFollowerIdAndFollowingId(userId, id);
        boolean following;
        if (existing.isPresent()) {
            followRepo.delete(existing.get());
            following = false;
        } else {
            followRepo.save(new Follow(userId, id));
            following = true;
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("following", following);
        resp.put("followers_count", followRepo.countByFollowingId(id));
        resp.put("following_count", followRepo.countByFollowerId(id));
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/users/{id}/follow-status")
    public ResponseEntity<Map<String, Object>> followStatus(
            @RequestHeader(value = "Authorization", required = false) String auth, @PathVariable String id) {
        String userId = extractUserId(auth);
        boolean following = userId != null && followRepo.existsByFollowerIdAndFollowingId(userId, id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("following", following);
        resp.put("followers_count", followRepo.countByFollowingId(id));
        resp.put("following_count", followRepo.countByFollowerId(id));
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/users/{id}/followers")
    public ResponseEntity<List<Map<String, Object>>> getFollowers(@PathVariable String id) {
        List<Follow> follows = followRepo.findByFollowingId(id);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Follow f : follows) {
            userRepo.findById(f.getFollowerId()).ifPresent(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("avatar_url", u.getAvatarUrl());
                result.add(m);
            });
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}/following")
    public ResponseEntity<List<Map<String, Object>>> getFollowing(@PathVariable String id) {
        List<Follow> follows = followRepo.findByFollowerId(id);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Follow f : follows) {
            userRepo.findById(f.getFollowingId()).ifPresent(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("avatar_url", u.getAvatarUrl());
                result.add(m);
            });
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @RequestHeader(value = "Authorization", required = false) String auth, @PathVariable String id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String currentUserId = extractUserId(auth);
        boolean following = currentUserId != null && followRepo.existsByFollowerIdAndFollowingId(currentUserId, id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", user.getId());
        resp.put("name", user.getName());
        resp.put("email", user.getEmail());
        resp.put("institution", user.getInstitution() != null ? user.getInstitution() : "");
        resp.put("bio", user.getBio() != null ? user.getBio() : "");
        resp.put("avatar_url", user.getAvatarUrl());
        resp.put("is_admin", user.isAdmin());
        resp.put("created_at", user.getCreatedAt().toString());
        resp.put("followers_count", followRepo.countByFollowingId(id));
        resp.put("following_count", followRepo.countByFollowerId(id));
        resp.put("is_following", following);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("Authorization") String auth, @RequestBody Map<String, String> body) {
        String userId = extractUserId(auth);
        if (userId == null) return ResponseEntity.status(401).build();
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("institution")) user.setInstitution(body.get("institution"));
        if (body.containsKey("bio")) user.setBio(body.get("bio"));
        if (body.containsKey("avatar_url")) user.setAvatarUrl(body.get("avatar_url"));
        userRepo.save(user);
        return ResponseEntity.ok(getProfile(auth, userId).getBody());
    }

    private String extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        Claims claims = jwtProvider.validateToken(authHeader.substring(7));
        return claims != null ? claims.get("sub", String.class) : null;
    }
}
