package com.intech.dukaantech.user.repository;

<<<<<<< HEAD
<<<<<<< HEAD
public interface UserRepository {
=======
import com.intech.dukaantech.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

=======
import com.intech.dukaantech.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
>>>>>>> user-manage
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUserId(String userId);
<<<<<<< HEAD
>>>>>>> Manage_item
=======

    Optional<UserEntity> findByName(String name);

    List<UserEntity> findByNameContainingIgnoreCase(String name);
>>>>>>> user-manage
}
