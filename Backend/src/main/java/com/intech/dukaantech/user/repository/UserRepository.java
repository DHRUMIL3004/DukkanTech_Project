package com.intech.dukaantech.user.repository;

<<<<<<< HEAD
public interface UserRepository {
=======
import com.intech.dukaantech.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUserId(String userId);
>>>>>>> Manage_item
}
