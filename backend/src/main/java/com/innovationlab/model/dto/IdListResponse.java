package com.innovationlab.model.dto;

import java.util.List;

public class IdListResponse {
    private List<String> ids;

    public IdListResponse(List<String> ids) {
        this.ids = ids;
    }

    public List<String> getIds() { return ids; }
    public void setIds(List<String> ids) { this.ids = ids; }
}
