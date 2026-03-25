package com.intech.dukaantech.payment.dto;

import lombok.Data;

@Data
public class CancelPaymentRequest {
    private String receipt;
    private String razorpayOrderId;
    private String reason;
}
