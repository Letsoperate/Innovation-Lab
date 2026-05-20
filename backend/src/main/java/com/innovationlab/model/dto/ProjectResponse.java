package com.innovationlab.model.dto;

import java.time.Instant;
import java.util.List;

public class ProjectResponse {
    private String id;
    private String name;
    private String tagline;
    private String description;
    private String demoUrl;
    private String repoUrl;
    private String videoUrl;
    private String category;
    private String track;
    private String institution;
    private String teamName;
    private int teamSize;
    private String techStack;
    private String logoColor;
    private String logoInitial;
    private List<String> categories;
    private int upvotes;
    private int views;
    private int commentsCount;
    private double rating;
    private int innovationScore;
    private boolean isTrending;
    private boolean hasVideo;
    private int rank;
    private String rankLabel;
    private String userId;
    private String userName;
    private Instant createdAt;
    private Instant updatedAt;

    public ProjectResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }
    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTrack() { return track; }
    public void setTrack(String track) { this.track = track; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public int getTeamSize() { return teamSize; }
    public void setTeamSize(int teamSize) { this.teamSize = teamSize; }
    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }
    public String getLogoColor() { return logoColor; }
    public void setLogoColor(String logoColor) { this.logoColor = logoColor; }
    public String getLogoInitial() { return logoInitial; }
    public void setLogoInitial(String logoInitial) { this.logoInitial = logoInitial; }
    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }
    public int getUpvotes() { return upvotes; }
    public void setUpvotes(int upvotes) { this.upvotes = upvotes; }
    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getInnovationScore() { return innovationScore; }
    public void setInnovationScore(int innovationScore) { this.innovationScore = innovationScore; }
    public boolean getIsTrending() { return isTrending; }
    public void setIsTrending(boolean trending) { isTrending = trending; }
    public boolean getHasVideo() { return hasVideo; }
    public void setHasVideo(boolean hasVideo) { this.hasVideo = hasVideo; }
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
    public String getRankLabel() { return rankLabel; }
    public void setRankLabel(String rankLabel) { this.rankLabel = rankLabel; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
