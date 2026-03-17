package com.intech.dukaantech.order.service;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.common.dto.PageResponse;


public interface OrderService {
    PageResponse<BillingResponse> fetchOrders(int page, int size);
}