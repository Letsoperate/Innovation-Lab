package com.innovationlab.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        HttpStatus status;

        if (message != null) {
            String lower = message.toLowerCase();
            if (lower.contains("already registered") || lower.contains("admin already exists")) {
                status = HttpStatus.BAD_REQUEST;
            } else if (lower.contains("invalid email") || lower.contains("invalid token")
                    || lower.contains("not authenticated")) {
                status = HttpStatus.UNAUTHORIZED;
            } else if (lower.contains("not authorized") || lower.contains("admin access")) {
                status = HttpStatus.FORBIDDEN;
            } else if (lower.contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return ResponseEntity.status(status).body(Map.of("detail", message != null ? message : "Internal server error"));
    }
}
