package com.intech.dukaantech.user.service;

import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.common.exception.custom.UserAlreadyExistsException;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.mapper.UserMapper;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserResponse createUser(UserRequest request) {

        log.info("Creating user with email: {}", request.getEmail());

        // check if username already exists
        if(userRepository.findByName(request.getName()).isPresent()){
            log.warn("User creation failed - username already exists: {}", request.getName());
            throw new UserAlreadyExistsException("Username already exists");
        }

        // Check if email already exists
        if(userRepository.findByEmail(request.getEmail().toLowerCase()).isPresent()){
            log.warn("User creation failed - email already exists: {}", request.getEmail());
            throw new UserAlreadyExistsException("Email already exists");
        }

        UserEntity user = userMapper.mapToEntity(request);

        user.setUserId(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail().toLowerCase());

        user = userRepository.save(user);

        log.info("User created successfully with id: {}", user.getUserId());

        return userMapper.mapToResponse(user);
    }

    // get user role
    @Override
    public String getUserRole(String email) {
        UserEntity getUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User Not Found"));

        return getUser.getRole().name();
    }

    // fetch all users and use pagination
    @Override
    public PageResponse<UserResponse> readUsers(int page, int size) {

        log.info("Fetching users with pagination - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);

        Page<UserEntity> userPage = userRepository.findAll(pageable);

        List<UserResponse> users = userPage.getContent()
                .stream()
                .map(userMapper::mapToResponse)
                .toList();

        log.debug("Fetched {} users from database", users.size());

        return PageResponse.<UserResponse>builder()
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .data(users)
                .build();
    }

    // Delete User
    @Override
    public void deleteUser(String id) {

        log.info("Deleting user with id: {}", id);

        UserEntity getUser = userRepository.findByUserId(id)
                .orElseThrow(()->new UsernameNotFoundException("User not found"));

        userRepository.delete(getUser);

        log.info("User deleted successfully: {}", id);
    }

    // Search Users Based on Name
    @Override
    public List<UserResponse> searchUsersByName(String name) {

        log.info("Searching users with name: {}", name);

        List<UserResponse> users = userRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(userMapper::mapToResponse)
                .toList();

        log.debug("Found {} users matching search: {}", users.size(), name);

        return users;
    }
}
