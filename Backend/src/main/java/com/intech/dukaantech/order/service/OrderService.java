package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import org.springframework.stereotype.Service;

import java.util.List;


public interface OrderService {
    List<BillingResponse> fetchOrders();
}
