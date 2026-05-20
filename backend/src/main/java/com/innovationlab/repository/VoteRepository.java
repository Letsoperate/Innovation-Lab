package com.innovationlab.repository;

import com.innovationlab.model.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, String> {
    Optional<Vote> findByProjectIdAndUserId(String projectId, String userId);
    List<Vote> findByUserId(String userId);
    List<Vote> findByProjectId(String projectId);
    long countByCreatedAtAfter(Instant date);
    void deleteByProjectId(String projectId);
}
