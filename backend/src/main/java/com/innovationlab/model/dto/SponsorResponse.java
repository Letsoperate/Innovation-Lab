package com.innovationlab.model.dto;

public class SponsorResponse {
    private String id;
    private String name;
    private String description;
    private String logo;
    private String color;
    private String textColor;

    public SponsorResponse() {}

    public SponsorResponse(String id, String name, String description, String logo, String color, String textColor) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.logo = logo;
        this.color = color;
        this.textColor = textColor;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }
}
