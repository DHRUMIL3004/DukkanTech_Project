package com.intech.dukaantech.billing.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Data
public class BillingResponse {

    private String orderId;
    private String customerName;
    private String phone;

    private BigDecimal subTotal;
    private BigDecimal totalTax;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private boolean paid;

    private Timestamp createdAt;

    private List<OrderItemResponse> items;
}