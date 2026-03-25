package com.intech.dukaantech.password.service;

import com.intech.dukaantech.password.entity.OtpEntity;
import com.intech.dukaantech.password.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Override
    public String generateOtp(String email) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        OtpEntity token = otpRepository.findByEmail(email);
        if (token == null) {
            token = new OtpEntity();
            token.setEmail(email);
        }

        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(token);

        return otp;
    }

    @Override
    public boolean validateOtp(String email, String otp) {

        OtpEntity token = otpRepository.findByEmail(email);

        if (token == null) {
            return false;
        }

        // Normalize values
        String storedOtp = token.getOtp().trim();
        String enteredOtp = otp.trim();

        // Strict match check
        if (!storedOtp.equals(enteredOtp)) {
            return false;
        }

        // Expiry check
        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        return true;
    }
    @Override
    @Transactional
    public void deleteOtp(String email) {
        otpRepository.deleteByEmail(email);
    }
}