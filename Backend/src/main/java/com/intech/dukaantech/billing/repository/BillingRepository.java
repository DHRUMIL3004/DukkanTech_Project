package com.intech.dukaantech.billing.repository;

import com.intech.dukaantech.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BillingRepository
        extends JpaRepository<Bill, Long>, JpaSpecificationExecutor<Bill> {
}