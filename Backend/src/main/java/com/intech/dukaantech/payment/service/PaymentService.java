package com.intech.dukaantech.payment.service;

import com.intech.dukaantech.payment.dto.*;

public interface PaymentService {
    CreatePaymentOrderResponse createRazorpayOrder(CreatePaymentOrderRequest request);

    VerifyPaymentResponse verifyRazorpayPayment(VerifyPaymentRequest request);

    CancelPaymentResponse cancelPayment(CancelPaymentRequest request);

    String getPublicKey();
}
