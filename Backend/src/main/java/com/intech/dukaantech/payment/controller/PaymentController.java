package com.intech.dukaantech.payment.controller;

import com.intech.dukaantech.payment.dto.*;
import com.intech.dukaantech.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/razorpay/order")
    public ResponseEntity<CreatePaymentOrderResponse> createRazorpayOrder(@RequestBody CreatePaymentOrderRequest request) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(request));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<VerifyPaymentResponse> verifyRazorpayPayment(@RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verifyRazorpayPayment(request));
    }

    @PostMapping("/razorpay/cancel")
    public ResponseEntity<CancelPaymentResponse> cancelPayment(@RequestBody CancelPaymentRequest request) {
        return ResponseEntity.ok(paymentService.cancelPayment(request));
    }

    @GetMapping("/razorpay/key")
    public ResponseEntity<Map<String, String>> getRazorpayPublicKey() {
        return ResponseEntity.ok(Map.of("keyId", paymentService.getPublicKey()));
    }
}
