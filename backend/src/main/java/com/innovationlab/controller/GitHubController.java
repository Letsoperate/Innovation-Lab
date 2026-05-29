package com.innovationlab.controller;

import com.innovationlab.model.dto.AuthResponse;
import com.innovationlab.model.dto.UserResponse;
import com.innovationlab.model.entity.User;
import com.innovationlab.repository.UserRepository;
import com.innovationlab.security.JwtProvider;
import com.innovationlab.service.GitHubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GitHubController {

    private final GitHubService gitHubService;
    private final UserRepository userRepo;
    private final JwtProvider jwtProvider;

    public GitHubController(GitHubService gitHubService, UserRepository userRepo, JwtProvider jwtProvider) {
        this.gitHubService = gitHubService;
        this.userRepo = userRepo;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/github/callback")
    public ResponseEntity<AuthResponse> githubCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String accessToken = gitHubService.exchangeCodeForToken(code);
        Map<String, Object> githubUser = gitHubService.getUserInfo(accessToken);

        String githubId = String.valueOf(githubUser.get("id"));
        String email = (String) githubUser.get("email");
        String name = (String) githubUser.get("name");
        String avatarUrl = (String) githubUser.get("avatar_url");

        if (email == null || email.isBlank()) {
            email = githubId + "@github.local";
        }
        if (name == null || name.isBlank()) {
            name = (String) githubUser.get("login");
        }

        Optional<User> existingUser = userRepo.findByGithubId(githubId);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            Optional<User> emailUser = userRepo.findByEmailIgnoreCase(email);
            if (emailUser.isPresent()) {
                user = emailUser.get();
                user.setGithubId(githubId);
                if (user.getAvatarUrl() == null) {
                    user.setAvatarUrl(avatarUrl);
                }
            } else {
                boolean isAdmin = userRepo.count() == 0;
                user = new User(name, email, "", "", isAdmin);
                user.setGithubId(githubId);
                user.setAvatarUrl(avatarUrl);
            }
            userRepo.save(user);
        }

        // JwtProvider.createToken takes Map<String,Object>
        String token = jwtProvider.createToken(Map.of(
            "sub", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "is_admin", user.isAdmin()
        ));

        // UserResponse constructor: (id, name, email, institution, isAdmin, createdAt)
        UserResponse userResponse = new UserResponse(
            user.getId(), user.getName(), user.getEmail(),
            user.getInstitution() != null ? user.getInstitution() : "",
            user.isAdmin(), user.getCreatedAt()
        );
        userResponse.setBio(user.getBio() != null ? user.getBio() : "");
        userResponse.setAvatarUrl(user.getAvatarUrl());
        userResponse.setGithubUrl(user.getGithubUrl());
        userResponse.setLinkedinUrl(user.getLinkedinUrl());
        userResponse.setWebsiteUrl(user.getWebsiteUrl());
        userResponse.setHobbies(user.getHobbies());

        // AuthResponse constructor: AuthResponse(String accessToken, UserResponse user)
        return ResponseEntity.ok(new AuthResponse(token, userResponse));
    }
}
