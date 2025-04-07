package com.corp.formmate.paymentschedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.corp.formmate.paymentschedule.entity.PaymentScheduleEntity;

@Repository
public interface PaymentScheduleRepository extends JpaRepository<PaymentScheduleEntity, Integer> {

}
