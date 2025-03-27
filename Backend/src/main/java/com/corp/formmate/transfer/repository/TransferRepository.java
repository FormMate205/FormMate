package com.corp.formmate.transfer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.transfer.entity.TransferEntity;

public interface TransferRepository extends JpaRepository<TransferEntity, Integer> {

	Optional<List<TransferEntity>> findByForm(FormEntity form);
}
