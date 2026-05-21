package com.innovationlab.model.dto;

import java.time.Instant;

public class HallOfFameItem {
    private String name;
    private String award;
    private String logoColor;
    private String logoInitial;
    private String dateWon;

    public HallOfFameItem() {}

    public HallOfFameItem(String name, String award, String logoColor, String logoInitial, String dateWon) {
        this.name = name;
        this.award = award;
        this.logoColor = logoColor;
        this.logoInitial = logoInitial;
        this.dateWon = dateWon;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAward() { return award; }
    public void setAward(String award) { this.award = award; }
    public String getLogoColor() { return logoColor; }
    public void setLogoColor(String logoColor) { this.logoColor = logoColor; }
    public String getLogoInitial() { return logoInitial; }
    public void setLogoInitial(String logoInitial) { this.logoInitial = logoInitial; }
    public String getDateWon() { return dateWon; }
    public void setDateWon(String dateWon) { this.dateWon = dateWon; }
}
