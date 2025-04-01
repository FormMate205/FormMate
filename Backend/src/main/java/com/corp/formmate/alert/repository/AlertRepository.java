package com.corp.formmate.alert.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.corp.formmate.alert.entity.AlertEntity;
import com.corp.formmate.user.entity.UserEntity;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, Integer> {

	// 특정 사용자의 읽지 않은 알림 조회 isDeleted가 false이고 isRead가 false인 알림만 조회
	List<AlertEntity> findByUserAndIsDeletedFalseAndIsReadFalseOrderByCreatedAtDesc(
		UserEntity user);

	// 특정 알림 ID보다 작은 ID를 가진 알림 조회 (페이징) isDeleted가 false인 알림만 조회
	@Query("SELECT a FROM AlertEntity a WHERE a.user = :user AND a.isDeleted = false " +
		"AND a.id < :alertId ORDER BY a.id DESC")
	Page<AlertEntity> findOlderAlertsById(
		@Param("user") UserEntity user,
		@Param("alertId") Integer alertId,
		Pageable pageable);

	// 첫 페이지 알림 조회 (alertId가 없을 때 사용)
	Page<AlertEntity> findByUserAndIsDeletedFalseOrderByIdDesc(
		UserEntity user, Pageable pageable);

	@Modifying
	@Query("UPDATE AlertEntity a SET a.isRead = true " +
		"WHERE a.user = :user AND a.isRead = false AND a.isDeleted = false")
	void markAllAsRead(@Param("user") UserEntity user);

	long countByUserAndIsDeletedFalseAndIsReadFalse(UserEntity user);

}
