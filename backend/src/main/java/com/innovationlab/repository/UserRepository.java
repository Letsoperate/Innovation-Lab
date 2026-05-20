package com.innovationlab.repository;

import com.innovationlab.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByOrderByCreatedAtAsc();
    Optional<User> findFirstByIsAdminTrue();
    boolean existsByIsAdminTrue();
    long countByCreatedAtAfter(Instant date);
}
