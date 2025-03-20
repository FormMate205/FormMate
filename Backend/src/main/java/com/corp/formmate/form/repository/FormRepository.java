package com.corp.formmate.form.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.corp.formmate.form.entity.FormEntity;

public interface FormRepository extends JpaRepository<FormEntity, Integer> {
}
