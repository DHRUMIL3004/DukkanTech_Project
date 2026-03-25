package com.intech.dukaantech.payment.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentOrderRequest {
    private BigDecimal amount;
    private String currency;
    private String receipt;
    private String customerName;
    private String phone;
    private String email;
}
