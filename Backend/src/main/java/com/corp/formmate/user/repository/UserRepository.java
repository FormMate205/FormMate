package com.corp.formmate.user.repository;

import com.corp.formmate.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    Optional<UserEntity> findByUserNameAndPhoneNumber(String userName, String phoneNumber);
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);


}
