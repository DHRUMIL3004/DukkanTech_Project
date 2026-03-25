
package com.intech.dukaantech.user.service;

import com.intech.dukaantech.common.exception.ApiException;
import com.intech.dukaantech.user.dto.UserRequest;
import com.intech.dukaantech.user.dto.UserResponse;
import com.intech.dukaantech.user.mapper.UserMapper;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        UserEntity newUser = userMapper.toEntity(request);

        newUser.setUserId(UUID.randomUUID().toString());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        newUser = userRepository.save(newUser);

        return userMapper.toResponse(newUser);
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
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity getUser = userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new ApiException("User not found", HttpStatus.NOT_FOUND));

        userRepository.delete(getUser);
    }

    @Override
    public UserResponse updateUser(String id, UserRequest request){

        log.info("Updating user with ID: {}", id);

        UserEntity updateUser = userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new ApiException("User not found", HttpStatus.NOT_FOUND));

        updateUser.setName(request.getName());

        if (request.getPassword() != null && !request.getPassword().isBlank()){
            updateUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        updateUser.setPassword(request.getPassword());

        log.info("User updated successfully: {}", id);

        updateUser = userRepository.save(updateUser);

        return userMapper.toResponse(updateUser);

    }
}
