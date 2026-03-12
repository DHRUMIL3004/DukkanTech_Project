package com.intech.dukaantech.user.dto;

import com.intech.dukaantech.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    private String name;
    private String email;
    private String password;
    private Role role;

}