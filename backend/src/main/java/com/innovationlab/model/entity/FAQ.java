package com.innovationlab.model.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "faq")
public class FAQ {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    public FAQ() {}

    public FAQ(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
