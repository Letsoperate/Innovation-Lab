package com.innovationlab.model.dto;

public class VoteResponse {
    private boolean voted;
    private int upvotes;

    public VoteResponse(boolean voted, int upvotes) {
        this.voted = voted;
        this.upvotes = upvotes;
    }

    public boolean isVoted() { return voted; }
    public int getUpvotes() { return upvotes; }
}
