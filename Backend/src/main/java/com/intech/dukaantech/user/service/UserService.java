package com.intech.dukaantech.user.service;

import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.common.dto.PageResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    PageResponse<UserResponse> readUsers(int page, int size, String search, String roleFilter, String sortBy, String sortDir);

    void deleteUser(String id);

    UserResponse updateUser(String id, UserRequest request);
}
