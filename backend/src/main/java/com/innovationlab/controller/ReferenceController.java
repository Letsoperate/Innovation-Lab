package com.innovationlab.controller;

import com.innovationlab.model.entity.*;
import com.innovationlab.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReferenceController {

    private final CategoryRepository categoryRepo;
    private final TrackRepository trackRepo;
    private final AudienceRepository audienceRepo;
    private final SponsorRepository sponsorRepo;
    private final BlogPostRepository blogPostRepo;
    private final FAQRepository faqRepo;

    public ReferenceController(CategoryRepository categoryRepo, TrackRepository trackRepo,
                               AudienceRepository audienceRepo, SponsorRepository sponsorRepo,
                               BlogPostRepository blogPostRepo, FAQRepository faqRepo) {
        this.categoryRepo = categoryRepo;
        this.trackRepo = trackRepo;
        this.audienceRepo = audienceRepo;
        this.sponsorRepo = sponsorRepo;
        this.blogPostRepo = blogPostRepo;
        this.faqRepo = faqRepo;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepo.findAll());
    }

    @GetMapping("/tracks")
    public ResponseEntity<List<Track>> getTracks() {
        return ResponseEntity.ok(trackRepo.findAll());
    }

    @GetMapping("/audiences")
    public ResponseEntity<List<Audience>> getAudiences() {
        return ResponseEntity.ok(audienceRepo.findAll());
    }

    @GetMapping("/sponsors")
    public ResponseEntity<List<Sponsor>> getSponsors() {
        return ResponseEntity.ok(sponsorRepo.findAll());
    }

    @GetMapping("/faq")
    public ResponseEntity<List<FAQ>> getFAQ() {
        return ResponseEntity.ok(faqRepo.findAll());
    }

    @GetMapping("/blog")
    public ResponseEntity<List<BlogPost>> getBlogPosts() {
        return ResponseEntity.ok(blogPostRepo.findAll());
    }

    @GetMapping("/blog/{id}")
    public ResponseEntity<BlogPost> getBlogPost(@PathVariable String id) {
        return ResponseEntity.ok(blogPostRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found")));
    }
}
