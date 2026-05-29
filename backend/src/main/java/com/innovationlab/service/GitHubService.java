package com.innovationlab.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GitHubService {

    @Value("${github.client.id:}")
    private String clientId;

    @Value("${github.client.secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public String exchangeCodeForToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        Map<String, String> body = Map.of(
            "client_id", clientId,
            "client_secret", clientSecret,
            "code", code
        );

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://github.com/login/oauth/access_token", request, Map.class
        );

        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            return (String) response.getBody().get("access_token");
        }
        throw new RuntimeException("Failed to exchange GitHub code for token");
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/json");
        headers.set("User-Agent", "InnovationLab");

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            "https://api.github.com/user", HttpMethod.GET, request, Map.class
        );

        if (response.getBody() != null) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to get GitHub user info");
    }
}
