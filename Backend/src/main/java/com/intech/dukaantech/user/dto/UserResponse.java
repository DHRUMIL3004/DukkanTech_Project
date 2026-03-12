package com.intech.dukaantech.user.dto;

<<<<<<< HEAD
<<<<<<< HEAD
public class UserResponse {
=======
import com.intech.dukaantech.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
=======
import com.intech.dukaantech.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
>>>>>>> user-manage

    private String userId;
    private String name;
    private String email;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Role role;
<<<<<<< HEAD
>>>>>>> Manage_item
=======
>>>>>>> user-manage
}
