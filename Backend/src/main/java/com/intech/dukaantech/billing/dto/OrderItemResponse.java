package com.intech.dukaantech.billing.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {

    private String itemName;
    private BigDecimal price;
    private int quantity;

    private BigDecimal tax;
    private BigDecimal taxAmount;
    private BigDecimal total;
}