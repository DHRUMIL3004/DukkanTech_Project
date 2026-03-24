package com.intech.dukaantech.payment.repository;

import com.intech.dukaantech.payment.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByReceipt(String receipt);

    Optional<PaymentTransaction> findByRazorpayOrderId(String razorpayOrderId);
}
