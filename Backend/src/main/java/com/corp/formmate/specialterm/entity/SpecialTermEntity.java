package com.corp.formmate.specialterm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import com.corp.formmate.form.entity.FormEntity;

@Entity
@Table(name = "special_terms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialTermEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// form_id -> Form
	@ManyToOne
	@JoinColumn(name = "form_id", nullable = false)
	private FormEntity form;

	@Column(name = "special_term_detail", nullable = false, columnDefinition = "TEXT")
	private String specialTermDetail;
}