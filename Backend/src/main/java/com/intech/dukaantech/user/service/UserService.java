package com.intech.dukaantech.user.service;

import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    PageResponse<UserResponse> readUsers(int page, int size);

    void deleteUser(String id);

    List<UserResponse> searchUsersByName(String name);
}
