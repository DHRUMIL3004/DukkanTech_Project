package com.intech.dukaantech.user.repository;

import com.intech.dukaantech.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByName(String name);

    Optional<UserEntity> findByNameIgnoreCase(String name);

    Optional<UserEntity> findByUserId(String userId);
}