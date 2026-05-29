package com.innovationlab.util;

public class SanitizeUtil {
    public static String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "")  // strip HTML tags
                    .replaceAll("&[a-zA-Z]+;", "")  // strip HTML entities
                    .replaceAll("javascript:", "")  // strip JS protocol
                    .trim();
    }
}
