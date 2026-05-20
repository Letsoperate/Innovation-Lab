package com.innovationlab.model.dto;

public class BookmarkResponse {
    private boolean bookmarked;

    public BookmarkResponse(boolean bookmarked) { this.bookmarked = bookmarked; }
    public boolean isBookmarked() { return bookmarked; }
}
