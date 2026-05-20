package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "sponsors")
public class Sponsor {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String logo;
    private String color;

    @Column(name = "text_color")
    private String textColor;

    public Sponsor() {}

    public Sponsor(String name, String description, String logo, String color, String textColor) {
        this.name = name;
        this.description = description;
        this.logo = logo;
        this.color = color;
        this.textColor = textColor;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }
}
