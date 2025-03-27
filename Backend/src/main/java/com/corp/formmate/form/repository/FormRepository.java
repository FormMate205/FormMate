package com.corp.formmate.form.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.user.entity.UserEntity;

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

	@Query(value =
		"SELECT u.* FROM users u " +
			"JOIN (" +
			"SELECT " +
			"CASE WHEN f.creditor_id = :userId THEN f.debtor_id ELSE f.creditor_id END AS partner_id, " +
			"MAX(f.id) as latest_form_id " +
			"FROM forms f " +
			"WHERE f.creditor_id = :userId OR f.debtor_id = :userId " +
			"GROUP BY partner_id" +
			") AS latest ON latest.partner_id = u.id " +
			"ORDER BY latest.latest_form_id DESC",
		countQuery =
			"SELECT COUNT(DISTINCT CASE WHEN f.creditor_id = :userId THEN f.debtor_id ELSE f.creditor_id END) " +
				"FROM forms f " +
				"WHERE f.creditor_id = :userId OR f.debtor_id = :userId",
		nativeQuery = true)
	Page<UserEntity> findDistinctContractedUsersByUserId(@Param("userId") Integer userId, Pageable pageable);

	@Query("SELECT f\n"
		+ "FROM FormEntity f\n"
		+ "WHERE f.creditor = :userId\n"
		+ "  AND f.debtor = :partnerId\n"
		+ "ORDER BY f.contractDate\n")
	Page<FormEntity> findUserIsCreditorSideForms(@Param("userId") Integer userId, @Param("partnerId") Integer partnerId, Pageable pageable);

	@Query("SELECT f\n"
		+ "FROM FormEntity f\n"
		+ "WHERE f.creditor = :partnerId\n"
		+ "  AND f.debtor = :userId\n"
		+ "ORDER BY f.contractDate\n")
	Page<FormEntity> findUserIsDebtorSideForms(@Param("userId") Integer userId, @Param("partnerId") Integer partnerId, Pageable pageable);
}
