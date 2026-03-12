package com.intech.dukaantech.user.service;

<<<<<<< HEAD
<<<<<<< HEAD
public interface UserService {
=======
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;

import java.util.List;

public interface UserService {
=======
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;

import java.util.List;

public interface UserService {
>>>>>>> user-manage

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

<<<<<<< HEAD
    List<UserResponse> readUsers();


    void deleteUser(String id);


>>>>>>> Manage_item
=======
    PageResponse<UserResponse> readUsers(int page, int size);

    void deleteUser(String id);

    List<UserResponse> searchUsersByName(String name);
>>>>>>> user-manage
}
