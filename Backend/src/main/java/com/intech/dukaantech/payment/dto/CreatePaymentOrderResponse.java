package com.intech.dukaantech.payment.dto;

import lombok.Data;

@Data
public class CreatePaymentOrderResponse {
    private String keyId;
    private String razorpayOrderId;
    private Long amountInPaise;
    private String currency;
    private String receipt;
    private String status;
    private boolean duplicate;
    private String message;
}
