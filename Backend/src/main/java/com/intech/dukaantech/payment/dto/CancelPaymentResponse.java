package com.intech.dukaantech.payment.dto;

import lombok.Data;

@Data
public class CancelPaymentResponse {
    private boolean cancelled;
    private boolean duplicate;
    private String status;
    private String message;
    private String receipt;
    private String razorpayOrderId;
}
