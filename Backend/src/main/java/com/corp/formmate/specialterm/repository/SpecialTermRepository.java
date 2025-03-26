package com.corp.formmate.specialterm.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.corp.formmate.specialterm.entity.SpecialTermEntity;

@Repository
public interface SpecialTermRepository extends JpaRepository<SpecialTermEntity, Integer> {
	List<SpecialTermEntity> findByFormIdOrderBySpecialTermIndexAsc(Integer formId);

	@Modifying
	@Query("DELETE FROM SpecialTermEntity st WHERE st.form.id = :formId AND st.specialTermIndex IN :indexes")
	void deleteByFormIdAndSpecialTermIndexIn(Integer formId, Collection<Integer> indexes);
}
