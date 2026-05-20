package com.innovationlab.repository;

import com.innovationlab.model.entity.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByProjectIdOrderByCreatedAtDesc(String projectId, Pageable pageable);
    List<Comment> findByProjectIdOrderByCreatedAtDesc(String projectId);
    void deleteByProjectId(String projectId);
}
