package com.intech.dukaantech.user.repository;

import com.intech.dukaantech.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUserId(String userId);

    Optional<UserEntity> findByName(String name);

    List<UserEntity> findByNameContainingIgnoreCase(String name);
}
