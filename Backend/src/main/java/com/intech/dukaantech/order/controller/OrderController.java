package com.intech.dukaantech.order.controller;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.service.BillingService;
import com.intech.dukaantech.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<List<BillingResponse>> fetchOrders() {
        return ResponseEntity.ok(orderService.fetchOrders());
    }
}
