package com.innovationlab.controller;

import com.innovationlab.model.dto.SponsorLoginRequest;
import com.innovationlab.model.dto.SponsorLoginResponse;
import com.innovationlab.model.entity.Sponsor;
import com.innovationlab.repository.SponsorRepository;
import com.innovationlab.security.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sponsor")
public class SponsorAuthController {

    private final SponsorRepository sponsorRepo;
    private final PasswordEncoder encoder;
    private final JwtProvider jwtProvider;

    public SponsorAuthController(SponsorRepository sponsorRepo, PasswordEncoder encoder, JwtProvider jwtProvider) {
        this.sponsorRepo = sponsorRepo;
        this.encoder = encoder;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<SponsorLoginResponse> login(@RequestBody SponsorLoginRequest req) {
        Sponsor sponsor = sponsorRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), sponsor.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        if (!sponsor.isActive()) {
            throw new RuntimeException("Sponsor account is inactive");
        }
        String token = jwtProvider.createToken(Map.of(
                "sub", sponsor.getId(),
                "role", "sponsor",
                "name", sponsor.getName()
        ));
        return ResponseEntity.ok(new SponsorLoginResponse(token, sponsor.getId(), sponsor.getName()));
    }
}
