package com.innovationlab.repository;

import com.innovationlab.model.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, String> {
    Optional<Bookmark> findByProjectIdAndUserId(String projectId, String userId);
    List<Bookmark> findByUserId(String userId);
    void deleteByProjectId(String projectId);
}
