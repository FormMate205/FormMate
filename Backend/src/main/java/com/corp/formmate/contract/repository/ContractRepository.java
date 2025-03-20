package com.corp.formmate.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.form.entity.FormEntity;

public interface ContractRepository extends JpaRepository<ContractEntity, Integer> {

	ContractEntity findByForm(FormEntity form);
}
