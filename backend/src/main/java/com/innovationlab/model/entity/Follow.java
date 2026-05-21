package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "follows", uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
public class Follow {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(name = "follower_id", length = 36, nullable = false)
    private String followerId;

    @Column(name = "following_id", length = 36, nullable = false)
    private String followingId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Follow() {}
    public Follow(String followerId, String followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public String getId() { return id; }
    public String getFollowerId() { return followerId; }
    public void setFollowerId(String followerId) { this.followerId = followerId; }
    public String getFollowingId() { return followingId; }
    public void setFollowingId(String followingId) { this.followingId = followingId; }
    public Instant getCreatedAt() { return createdAt; }
}
