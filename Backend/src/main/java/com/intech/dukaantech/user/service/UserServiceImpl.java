package com.intech.dukaantech.user.service;

import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity newUser = createNewUserInEntity(request);
        newUser = userRepository.save(newUser);
        return createUserResponse(newUser);
    }

    private UserResponse createUserResponse(UserEntity newUser) {

        return UserResponse.builder()
                .name(newUser.getName())
                .userId(newUser.getUserId())
                .email(newUser.getEmail())
                .role(newUser.getRole())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdatedAt())
                .build();
    }

    private UserEntity createNewUserInEntity(UserRequest request) {

        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .name(request.getName())
                .email(request.getEmail())
                .role(request.getRole().toUpperCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
    }

    @Override
    public String getUserRole(String email) {
        UserEntity getUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User Not Found"));

        return getUser.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(user->createUserResponse(user))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity getUser = userRepository.findByUserId(id)
                .orElseThrow(()->new UsernameNotFoundException("User not found"));

        userRepository.delete(getUser);
    }
}
