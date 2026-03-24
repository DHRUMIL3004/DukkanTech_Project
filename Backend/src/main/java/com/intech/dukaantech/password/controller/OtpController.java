package com.intech.dukaantech.password.controller;

import com.intech.dukaantech.inventory.service.EmailServices;
import com.intech.dukaantech.password.service.OtpService;

import com.intech.dukaantech.user.model.UserEntity;
import com.intech.dukaantech.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailServices emailServices;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestParam String email){
   if (!userRepository.findByEmail(email).isPresent()){
       return ResponseEntity.badRequest().body("User not found");
   }

     String otp = otpService.generateOtp(email);

     emailServices.sendOtpEmail(email,"OTP Verification","Your password reset Otp is : "+otp+". Valid for 5 minutes.");

      return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify")
    public String varifyOtp(@RequestParam String email,@RequestParam String otp){
      if (!otpService.validateOtp(email,otp)){
        return "otp is invalid";
      }
      return "otp is varified";
    }

    @PostMapping("/reset-password")
    @Transactional
    public String resetPassword(@RequestParam String email,@RequestParam String newPassword){

        Optional<UserEntity> user=userRepository.findByEmail(email);

        user.get().setPassword(passwordEncoder.encode(newPassword));


        userRepository.save(user.get());

        otpService.deleteOtp(email);

        return "Password is reset successfully";
    }
}
