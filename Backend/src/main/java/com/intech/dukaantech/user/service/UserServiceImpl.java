
package com.intech.dukaantech.user.service;

import com.intech.dukaantech.common.exception.custom.DuplicateResourceException;
import com.intech.dukaantech.common.exception.custom.ResourceNotFoundException;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.mapper.UserMapper;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserResponse createUser(UserRequest request) {

        String requestedName = request.getName() == null ? null : request.getName().trim();

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (requestedName != null && !requestedName.isBlank() && userRepository.findByNameIgnoreCase(requestedName).isPresent()) {
            throw new DuplicateResourceException("Name already exists");
        }

        UserEntity newUser = userMapper.toEntity(request);

        newUser.setUserId(UUID.randomUUID().toString());
        if (requestedName != null && !requestedName.isBlank()) {
            newUser.setName(requestedName);
        }
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        newUser = userRepository.save(newUser);

        return userMapper.toResponse(newUser);
    }

    @Override
    public String getUserRole(String email) {
        UserEntity getUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        return getUser.getRole().name();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity getUser = userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        userRepository.delete(getUser);
    }

    @Override
    public UserResponse updateUser(String id, UserRequest request){

        log.info("Updating user with ID: {}", id);

        UserEntity updateUser = userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        String requestedName = request.getName() == null ? null : request.getName().trim();
        if (requestedName != null && !requestedName.isBlank()) {
            UserEntity existingUser = userRepository.findByNameIgnoreCase(requestedName).orElse(null);
            if (existingUser != null && !existingUser.getUserId().equals(updateUser.getUserId())) {
                throw new DuplicateResourceException("Name already exists");
            }
            updateUser.setName(requestedName);
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()){
            updateUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }


        log.info("User updated successfully: {}", id);

        updateUser = userRepository.save(updateUser);

        return userMapper.toResponse(updateUser);

    }
}
