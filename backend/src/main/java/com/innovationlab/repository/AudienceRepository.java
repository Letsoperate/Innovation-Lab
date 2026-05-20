package com.innovationlab.repository;

import com.innovationlab.model.entity.Audience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AudienceRepository extends JpaRepository<Audience, String> {}
