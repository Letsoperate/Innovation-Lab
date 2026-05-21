package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "demo_url")
    private String demoUrl;

    @Column(name = "repo_url")
    private String repoUrl;

    @Column(name = "video_url")
    private String videoUrl;

    private String category;
    private String track;
    private String institution;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "team_size")
    private int teamSize = 1;

    @Column(name = "tech_stack")
    private String techStack;

    @Column(name = "logo_color")
    private String logoColor = "#009639";

    @Column(name = "logo_initial")
    private String logoInitial;

    @Column(name = "logo_image")
    private String logoImage;

    private int upvotes = 0;
    private int views = 0;

    @Column(name = "comments_count")
    private int commentsCount = 0;

    private double rating = 0.0;

    @Column(name = "innovation_score")
    private int innovationScore = 0;

    @Column(name = "is_trending")
    private boolean isTrending = true;

    @Column(name = "has_video")
    private boolean hasVideo = false;

    @Column(name = "is_featured")
    private boolean isFeatured = false;

    @Column(name = "award_won")
    private String awardWon;

    @Column(unique = true)
    private String slug;

    private int rank = 0;

    @Column(name = "rank_label")
    private String rankLabel;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Project() {}

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
    public String getLogoImage() { return logoImage; }
    public void setLogoImage(String logoImage) { this.logoImage = logoImage; }
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
    public boolean isTrending() { return isTrending; }
    public void setTrending(boolean trending) { isTrending = trending; }
    public boolean isHasVideo() { return hasVideo; }
    public void setHasVideo(boolean hasVideo) { this.hasVideo = hasVideo; }
    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }
    public String getAwardWon() { return awardWon; }
    public void setAwardWon(String awardWon) { this.awardWon = awardWon; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
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
