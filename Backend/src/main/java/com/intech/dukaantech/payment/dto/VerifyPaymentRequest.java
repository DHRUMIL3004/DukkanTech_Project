package com.intech.dukaantech.payment.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private String receipt;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
