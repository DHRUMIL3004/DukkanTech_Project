package com.intech.dukaantech.authentication.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CurrentUser {
    private Long id;
    private String role;

    @Override
    public String toString() {
        return "id=" + id + "|role=" + role;
    }
}