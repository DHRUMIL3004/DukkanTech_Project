package com.intech.dukaantech.user.controller;

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

    private final UserService userService;

    // Create User
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody UserRequest request){

        UserResponse response = userService.createUser(request);
        return ResponseEntity.ok(response);
    }

    // Get All Users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(){

        return ResponseEntity.ok(userService.readUsers());
    }

    // Delete User
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable String userId){

        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
