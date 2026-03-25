package com.intech.dukaantech.password.service;

public interface OtpService {

    String generateOtp(String email);

    boolean validateOtp(String email,String otp);

    void deleteOtp(String email);
}
