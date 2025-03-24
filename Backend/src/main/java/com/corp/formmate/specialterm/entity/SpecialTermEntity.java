package com.corp.formmate.specialterm.entity;

import java.io.Serializable;

import com.corp.formmate.form.entity.FormEntity;

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
public class SpecialTermEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// form_id -> Form
	@ManyToOne
	@JoinColumn(name = "form_id", nullable = false)
	private FormEntity form;

	@Column(name = "special_term_detail", nullable = false, columnDefinition = "TEXT")
	private String specialTermDetail;

	@Column(name = "special_term_index", nullable = false)
	private Integer specialTermIndex;

}