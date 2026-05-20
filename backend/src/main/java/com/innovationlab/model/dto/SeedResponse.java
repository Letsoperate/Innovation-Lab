package com.innovationlab.model.dto;

import java.util.Map;

public class SeedResponse {
    private String message;
    private Map<String, Integer> counts;

    public SeedResponse(String message, Map<String, Integer> counts) {
        this.message = message;
        this.counts = counts;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Map<String, Integer> getCounts() { return counts; }
    public void setCounts(Map<String, Integer> counts) { this.counts = counts; }
}
