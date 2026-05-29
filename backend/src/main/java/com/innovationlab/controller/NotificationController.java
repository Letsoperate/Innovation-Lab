package com.innovationlab.controller;

import com.innovationlab.model.entity.Notification;
import com.innovationlab.security.JwtProvider;
import com.innovationlab.service.NotificationService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtProvider jwtProvider;

    public NotificationController(NotificationService notificationService, JwtProvider jwtProvider) {
        this.notificationService = notificationService;
        this.jwtProvider = jwtProvider;
    }

    private String getUserId(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) throw new RuntimeException("Unauthorized");
        Claims claims = jwtProvider.validateToken(auth.substring(7));
        return claims != null ? claims.get("sub", String.class) : null;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestHeader("Authorization") String auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        String userId = getUserId(auth);
        return ResponseEntity.ok(notificationService.getNotifications(userId, page, limit));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String auth) {
        String userId = getUserId(auth);
        Map<String, Long> result = new HashMap<>();
        result.put("count", notificationService.getUnreadCount(userId));
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
            @RequestHeader("Authorization") String auth,
            @PathVariable String id) {
        String userId = getUserId(auth);
        notificationService.markRead(id, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(
            @RequestHeader("Authorization") String auth) {
        String userId = getUserId(auth);
        notificationService.markAllRead(userId);
        return ResponseEntity.ok().build();
    }
}
