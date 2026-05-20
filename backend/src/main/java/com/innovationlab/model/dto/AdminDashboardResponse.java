package com.innovationlab.model.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardResponse {
    private int totalProjects;
    private int totalUsers;
    private int totalVotes;
    private int totalComments;
    private int totalBookmarks;
    private int projectsToday;
    private int votesToday;
    private int usersToday;
    private List<Map<String, Object>> topCategories;

    public AdminDashboardResponse() {}

    public int getTotalProjects() { return totalProjects; }
    public void setTotalProjects(int totalProjects) { this.totalProjects = totalProjects; }
    public int getTotalUsers() { return totalUsers; }
    public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }
    public int getTotalVotes() { return totalVotes; }
    public void setTotalVotes(int totalVotes) { this.totalVotes = totalVotes; }
    public int getTotalComments() { return totalComments; }
    public void setTotalComments(int totalComments) { this.totalComments = totalComments; }
    public int getTotalBookmarks() { return totalBookmarks; }
    public void setTotalBookmarks(int totalBookmarks) { this.totalBookmarks = totalBookmarks; }
    public int getProjectsToday() { return projectsToday; }
    public void setProjectsToday(int projectsToday) { this.projectsToday = projectsToday; }
    public int getVotesToday() { return votesToday; }
    public void setVotesToday(int votesToday) { this.votesToday = votesToday; }
    public int getUsersToday() { return usersToday; }
    public void setUsersToday(int usersToday) { this.usersToday = usersToday; }
    public List<Map<String, Object>> getTopCategories() { return topCategories; }
    public void setTopCategories(List<Map<String, Object>> topCategories) { this.topCategories = topCategories; }
}
