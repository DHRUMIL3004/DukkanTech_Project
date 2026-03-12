package com.intech.dukaantech.authentication.service;

import com.intech.dukaantech.authentication.dto.LoginRequest;
import com.intech.dukaantech.authentication.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}
