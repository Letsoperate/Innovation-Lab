package com.innovationlab.config;

import com.innovationlab.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final RateLimitFilter rateLimitFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter, RateLimitFilter rateLimitFilter) {
        this.jwtFilter = jwtFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/github/callback").permitAll()
                .requestMatchers("/api/sponsor/login", "/api/admin/login").permitAll()
                .requestMatchers("/api/health", "/api/", "/api/stats", "/api/categories",
                    "/api/tracks", "/api/audiences", "/api/sponsors", "/api/faq",
                    "/api/blog", "/api/blog/**", "/api/leaderboard", "/api/hall-of-fame",
                    "/api/projects", "/api/projects/grouped", "/api/projects/slug/{slug}", "/api/projects/{id}",
                    "/api/search", "/api/seed").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/{id}/profile").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/{id}/followers").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/{id}/following").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/{id}/bookmarks").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/notifications/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(rateLimitFilter, JwtAuthenticationFilter.class)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
