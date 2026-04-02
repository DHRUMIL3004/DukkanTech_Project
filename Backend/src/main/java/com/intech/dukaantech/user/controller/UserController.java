package com.intech.dukaantech.user.controller;

import com.intech.dukaantech.authentication.dto.LoginResponse;
import com.intech.dukaantech.authentication.security.JwtUtil;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import com.intech.dukaantech.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // Create User
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest request) {

        return ResponseEntity.ok(userService.createUser(request));
    }

    // Get All Users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String role,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {

        return ResponseEntity.ok(userService.readUsers(page, size, search, role, sortBy, sortDir));
    }

    // Delete User
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {

        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Update User
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserRequest request){
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(Authentication authentication) {

        String email=authentication.getName();

        Optional<UserEntity> user=userRepository.findByEmail(email);
        return ResponseEntity.ok(user.get().getName());
    }
}
