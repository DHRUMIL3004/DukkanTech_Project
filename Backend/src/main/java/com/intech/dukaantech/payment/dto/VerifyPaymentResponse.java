package com.intech.dukaantech.payment.dto;

import lombok.Data;

@Data
public class VerifyPaymentResponse {
    private boolean verified;
    private boolean duplicate;
    private String status;
    private String message;
    private String receipt;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String paymentMethod;
}
