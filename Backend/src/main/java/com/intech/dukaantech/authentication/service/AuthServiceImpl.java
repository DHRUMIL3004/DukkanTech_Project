package com.intech.dukaantech.authentication.service;

import com.intech.dukaantech.authentication.dto.LoginRequest;
import com.intech.dukaantech.authentication.dto.LoginResponse;
import com.intech.dukaantech.authentication.security.JwtUtil;
import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(token);
    }
}