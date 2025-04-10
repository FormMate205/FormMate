package com.corp.formmate.paymentschedule.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.paymentschedule.entity.PaymentScheduleEntity;

@Repository
public interface PaymentScheduleRepository extends JpaRepository<PaymentScheduleEntity, Integer> {

	List<PaymentScheduleEntity> findByContract(ContractEntity contractEntity);

	Optional<PaymentScheduleEntity> findFirstByContractAndIsPaidOrderByPaymentRoundAsc(ContractEntity contract,
		Boolean isPaid);

	List<PaymentScheduleEntity> findByContractAndPaymentRoundLessThanEqualAndIsPaidFalse(
		ContractEntity contract,
		Integer paymentRound
	);

	List<PaymentScheduleEntity> findByContractOrderByPaymentRoundAsc(ContractEntity contract);

	Optional<PaymentScheduleEntity> findByContractAndPaymentRound(ContractEntity contract, Integer paymentRound);

	Optional<PaymentScheduleEntity> findFirstByContractAndIsPaidFalseOrderByPaymentRoundAsc(ContractEntity contract);

}
