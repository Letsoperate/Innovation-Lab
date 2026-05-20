package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "blog_posts")
public class BlogPost {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String date;

    @Column(name = "category")
    private String category;

    @Column(name = "read_time")
    private String readTime;

    public BlogPost() {}

    public BlogPost(String title, String excerpt, String content, String date, String category, String readTime) {
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.date = date;
        this.category = category;
        this.readTime = readTime;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getReadTime() { return readTime; }
    public void setReadTime(String readTime) { this.readTime = readTime; }
}
