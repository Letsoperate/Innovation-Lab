package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "tracks")
public class Track {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    public Track() {}

    public Track(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
}
