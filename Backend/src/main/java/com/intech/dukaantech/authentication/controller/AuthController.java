package com.intech.dukaantech.authentication.controller;

import com.intech.dukaantech.authentication.dto.LoginRequest;
import com.intech.dukaantech.authentication.dto.LoginResponse;
import com.intech.dukaantech.authentication.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){

        return authService.login(request);
    }
}
