package com.corp.formmate.fcmtoken.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.corp.formmate.fcmtoken.entity.FcmTokenEntity;
import com.corp.formmate.user.entity.UserEntity;

@Repository
public interface FcmTokenRepository extends JpaRepository<FcmTokenEntity, Integer> {

	Optional<FcmTokenEntity> findByUser(UserEntity user);

	boolean existsByUser(UserEntity user);

}
