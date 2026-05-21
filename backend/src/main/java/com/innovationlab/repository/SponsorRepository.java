package com.innovationlab.repository;

import com.innovationlab.model.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SponsorRepository extends JpaRepository<Sponsor, String> {
    Optional<Sponsor> findByEmail(String email);
}
