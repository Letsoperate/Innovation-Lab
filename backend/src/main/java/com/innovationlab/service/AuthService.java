package com.innovationlab.service;

import com.innovationlab.model.dto.*;
import com.innovationlab.model.entity.User;
import com.innovationlab.repository.UserRepository;
import com.innovationlab.security.JwtProvider;
import com.innovationlab.util.SanitizeUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        String email = req.getEmail().toLowerCase().trim();
        if (userRepo.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        String password = req.getPassword();
        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new RuntimeException("Password must contain at least one number");
        }
        boolean isAdmin = userRepo.count() == 0;
        User user = new User(
            SanitizeUtil.sanitize(req.getName()), email,
            encoder.encode(req.getPassword()),
            req.getInstitution() != null ? SanitizeUtil.sanitize(req.getInstitution()) : "",
            isAdmin
        );
        userRepo.save(user);

        String token = jwtProvider.createToken(Map.of(
            "sub", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "is_admin", user.isAdmin()
        ));

        return new AuthResponse(token, toResponse(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmailIgnoreCase(req.getEmail().toLowerCase().trim())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtProvider.createToken(Map.of(
            "sub", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "is_admin", user.isAdmin()
        ));
        return new AuthResponse(token, toResponse(user));
    }

    public UserResponse getMe(String userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateProfile(String userId, ProfileUpdateRequest req) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getName() != null && !req.getName().isBlank()) user.setName(SanitizeUtil.sanitize(req.getName()));
        if (req.getInstitution() != null) user.setInstitution(SanitizeUtil.sanitize(req.getInstitution()));
        userRepo.save(user);
        return toResponse(user);
    }

    private UserResponse toResponse(User u) {
        UserResponse r = new UserResponse(u.getId(), u.getName(), u.getEmail(),
            u.getInstitution() != null ? u.getInstitution() : "",
            u.isAdmin(), u.getCreatedAt());
        r.setBio(u.getBio() != null ? u.getBio() : "");
        r.setAvatarUrl(u.getAvatarUrl());
        return r;
    }
}
