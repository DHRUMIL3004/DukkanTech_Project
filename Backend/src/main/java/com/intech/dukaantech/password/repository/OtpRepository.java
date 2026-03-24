package com.intech.dukaantech.password.repository;

import com.intech.dukaantech.password.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpRepository extends JpaRepository<OtpEntity,Long> {

    OtpEntity findByEmail(String email);

    void deleteByEmail(String email);
}
