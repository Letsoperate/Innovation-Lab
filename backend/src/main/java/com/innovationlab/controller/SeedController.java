package com.innovationlab.controller;

import com.innovationlab.model.dto.SeedResponse;
import com.innovationlab.service.SeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class SeedController {

    private final SeedService seedService;

    public SeedController(SeedService seedService) {
        this.seedService = seedService;
    }

    @PostMapping("/seed")
    public ResponseEntity<SeedResponse> seed() {
        Map<String, Integer> counts = seedService.seed();
        return ResponseEntity.ok(new SeedResponse("Database seeded successfully", counts));
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        return ResponseEntity.ok(Map.of(
                "message", "Innovation Lab API",
                "status", "running"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
