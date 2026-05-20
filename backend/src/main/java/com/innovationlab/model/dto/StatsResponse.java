package com.innovationlab.model.dto;

public class StatsResponse {
    private int totalProjects;
    private int totalVotes;
    private int totalParticipants;
    private int totalInstitutions;
    private String currentRound = "Finals";
    private int daysRemaining = 14;

    public StatsResponse(int totalProjects, int totalVotes, int totalParticipants, int totalInstitutions) {
        this.totalProjects = totalProjects;
        this.totalVotes = totalVotes;
        this.totalParticipants = totalParticipants;
        this.totalInstitutions = totalInstitutions;
    }

    public int getTotalProjects() { return totalProjects; }
    public int getTotalVotes() { return totalVotes; }
    public int getTotalParticipants() { return totalParticipants; }
    public int getTotalInstitutions() { return totalInstitutions; }
    public String getCurrentRound() { return currentRound; }
    public int getDaysRemaining() { return daysRemaining; }
}
