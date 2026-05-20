package com.innovationlab.repository;

import com.innovationlab.model.entity.BlogPost;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, String> {
    List<BlogPost> findAllByOrderByDateDesc(Pageable pageable);
    List<BlogPost> findAllByOrderByDateDesc();
}
