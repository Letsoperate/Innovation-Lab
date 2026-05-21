package com.innovationlab.model.dto;

public class SponsorLoginResponse {
    private String token;
    private String tokenType = "bearer";
    private String sponsorId;
    private String name;

    public SponsorLoginResponse(String token, String sponsorId, String name) {
        this.token = token;
        this.sponsorId = sponsorId;
        this.name = name;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public String getSponsorId() { return sponsorId; }
    public String getName() { return name; }
}
