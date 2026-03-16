package com.intech.dukaantech.billing.dto;

import lombok.Data;

@Data
public class OrderItemRequest {

    private String itemId;
    private int quantity;
}
