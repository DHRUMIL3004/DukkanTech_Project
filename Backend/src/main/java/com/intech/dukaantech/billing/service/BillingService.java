package com.intech.dukaantech.billing.service;

import com.intech.dukaantech.billing.dto.BillingRequest;
import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.model.Bill;

import java.math.BigDecimal;
import java.util.List;

public interface BillingService {
    BillingResponse createOrder(BillingRequest request);

    BigDecimal getTotalAmounts(String customerId);


    Bill getBillByOrderId(String orderid);
}
