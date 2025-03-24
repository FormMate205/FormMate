package com.corp.formmate.form.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;

@Repository
public interface FormRepository extends JpaRepository<FormEntity, Integer> {

	@Query("SELECT f FROM FormEntity f WHERE (f.creditor.id = :userId OR f.debtor.id = :userId) " +
		"AND (:status IS NULL OR f.status = :status) " +
		"AND (:name IS NULL OR f.creditorName LIKE %:name% OR f.debtorName LIKE %:name%)")
	Page<FormEntity> findAllWithFilters(
		@Param("userId") Integer userId,
		@Param("status") FormStatus status,
		@Param("name") String name,
		Pageable pageable);

	@Query("SELECT COUNT(f) FROM FormEntity f WHERE (f.creditor.id = :userId OR f.debtor.id = :userId) AND f.status = :status")
	Integer countByCreditorIdOrDebtorIdAndStatus(@Param("userId") Integer userId, @Param("status") FormStatus status);

	@Query("SELECT COUNT(f) FROM FormEntity f WHERE f.creditor.id = :userId AND f.status = :status")
	Integer countByCreditorIdAndStatus(@Param("userId") Integer userId, @Param("status") FormStatus status);

	@Query("SELECT COUNT(f) FROM FormEntity f WHERE f.debtor.id = :userId AND f.status = :status")
	Integer countByDebtorIdAndStatus(@Param("userId") Integer userId, @Param("status") FormStatus status);

}
