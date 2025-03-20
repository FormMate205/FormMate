package com.corp.formmate.specialterm.entity;

import com.corp.formmate.contract.entity.ContractEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "special_terms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialTermEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// FK: contract_id -> contracts.id
	@ManyToOne
	@JoinColumn(name = "contract_id", nullable = false)
	private ContractEntity contract;

	@Column(name = "special_term_detail", columnDefinition = "TEXT", nullable = false)
	private String specialTermDetail;
}
