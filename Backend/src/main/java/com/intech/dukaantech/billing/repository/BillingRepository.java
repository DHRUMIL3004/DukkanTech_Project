package com.intech.dukaantech.billing.repository;

import com.intech.dukaantech.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface BillingRepository
        extends JpaRepository<Bill, Long>, JpaSpecificationExecutor<Bill> {

    Optional<Bill> findByCustomerId(String customerId);

    Optional<Bill> findByOrderId(String orderId);

    @Query("SELECT SUM(b.totalAmount) FROM Bill b")
    BigDecimal getTotalRevenue();
}