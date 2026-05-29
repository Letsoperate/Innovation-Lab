package com.innovationlab.repository;

import com.innovationlab.model.entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
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
}
