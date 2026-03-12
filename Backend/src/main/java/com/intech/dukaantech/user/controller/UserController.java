package com.intech.dukaantech.user.controller;

<<<<<<< HEAD
<<<<<<< HEAD
public class UserController {
=======
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
=======
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
>>>>>>> user-manage

    private final UserService userService;

    // Create User
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
<<<<<<< HEAD
            @RequestBody UserRequest request){
=======
            @Valid @RequestBody UserRequest request){
>>>>>>> user-manage

        UserResponse response = userService.createUser(request);
        return ResponseEntity.ok(response);
    }

    // Get All Users
    @GetMapping
<<<<<<< HEAD
    public ResponseEntity<List<UserResponse>> getUsers(){

        return ResponseEntity.ok(userService.readUsers());
=======
    public ResponseEntity<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return ResponseEntity.ok(userService.readUsers(page, size));
>>>>>>> user-manage
    }

    // Delete User
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable String userId){

        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
<<<<<<< HEAD
>>>>>>> Manage_item
=======

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam String name){

        return ResponseEntity.ok(userService.searchUsersByName(name));
    }
>>>>>>> user-manage
}
