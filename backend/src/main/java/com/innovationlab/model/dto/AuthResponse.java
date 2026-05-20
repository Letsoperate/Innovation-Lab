package com.innovationlab.model.dto;

public class AuthResponse {
    private String accessToken;
    private String tokenType = "bearer";
    private UserResponse user;

    public AuthResponse(String accessToken, UserResponse user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public String getTokenType() { return tokenType; }
    public UserResponse getUser() { return user; }
}
