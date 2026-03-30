package com.intech.dukaantech.billing.controller;

import com.intech.dukaantech.billing.dto.BillingRequest;
import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.model.Bill;
import com.intech.dukaantech.billing.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PreAuthorize("hasAnyRole('ADMIN','CASHIER')")
    @PostMapping("/create")
    public ResponseEntity<BillingResponse> createOrder(@RequestBody BillingRequest request){
        return   ResponseEntity.ok(billingService.createOrder(request));
    }



}
