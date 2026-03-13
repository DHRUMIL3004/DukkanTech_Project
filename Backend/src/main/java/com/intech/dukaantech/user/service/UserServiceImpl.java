package com.intech.dukaantech.user.service;

import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public UserResponse createUser(UserRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");

        }

        UserEntity newUser = createNewUserInEntity(request);
        newUser = userRepository.save(newUser);
        return createUserResponse(newUser);
    }

    private UserResponse createUserResponse(UserEntity user) {
        return modelMapper.map(user, UserResponse.class);
    }

    private UserEntity createNewUserInEntity(UserRequest request) {

        UserEntity user = modelMapper.map(request, UserEntity.class);

        user.setUserId(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return user;
    }

    @Override
    public String getUserRole(String email) {
        UserEntity getUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        return getUser.getRole().name();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::createUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity getUser = userRepository.findByUserId(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        userRepository.delete(getUser);
    }
}