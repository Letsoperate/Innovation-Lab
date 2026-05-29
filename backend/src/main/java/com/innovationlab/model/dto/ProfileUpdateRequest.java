package com.innovationlab.model.dto;

public class ProfileUpdateRequest {
    private String name;
    private String institution;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String hobbies;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
}
