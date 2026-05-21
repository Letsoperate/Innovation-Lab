package com.innovationlab.model.dto;

import java.time.Instant;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String institution;
    private boolean isAdmin;
    private String bio;
    private String avatarUrl;
    private Instant createdAt;

    public UserResponse(String id, String name, String email, String institution, boolean isAdmin, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.institution = institution;
        this.isAdmin = isAdmin;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getInstitution() { return institution; }
    public boolean getIsAdmin() { return isAdmin; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public Instant getCreatedAt() { return createdAt; }
}
