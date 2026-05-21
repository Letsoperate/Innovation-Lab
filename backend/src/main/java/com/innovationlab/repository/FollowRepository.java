package com.innovationlab.repository;

import com.innovationlab.model.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, String> {
    Optional<Follow> findByFollowerIdAndFollowingId(String followerId, String followingId);
    List<Follow> findByFollowerId(String followerId);
    List<Follow> findByFollowingId(String followingId);
    long countByFollowerId(String followerId);
    long countByFollowingId(String followingId);
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
}
