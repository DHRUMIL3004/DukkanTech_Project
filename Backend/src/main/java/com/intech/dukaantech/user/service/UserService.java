package com.intech.dukaantech.user.service;

import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String id);
}