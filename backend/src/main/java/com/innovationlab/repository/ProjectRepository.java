package com.innovationlab.repository;

import com.innovationlab.model.entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String>, JpaSpecificationExecutor<Project> {
    List<Project> findByUserId(String userId, Pageable pageable);
    List<Project> findByCreatedAtAfter(Instant date, Pageable pageable);
    List<Project> findByCreatedAtBetween(Instant start, Instant end, Pageable pageable);
    long countByUserId(String userId);
    long countByCreatedAtAfter(Instant date);
    long countByCategory(String category);
    long countByCategoryAndCreatedAtAfter(String category, Instant date);
    Optional<Project> findBySlug(String slug);

    @Query("SELECT p FROM Project p WHERE p.userId IN " +
           "(SELECT f.followingId FROM Follow f WHERE f.followerId = :userId) " +
           "ORDER BY p.createdAt DESC")
    List<Project> findProjectsFromFollowedUsers(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.userId IN " +
           "(SELECT f.followingId FROM Follow f WHERE f.followerId = :userId)")
    long countProjectsFromFollowedUsers(@Param("userId") String userId);
}
