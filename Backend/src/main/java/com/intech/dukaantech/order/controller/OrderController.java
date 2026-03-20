package com.intech.dukaantech.order.controller;

import com.intech.dukaantech.billing.dto.BillingResponse;
import com.intech.dukaantech.billing.service.BillingService;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @GetMapping("/orders")
    public ResponseEntity<PageResponse<BillingResponse>> fetchOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(
                orderService.fetchOrders(page, size, search, fromDate, toDate, sortBy, sortDir)
        );
    }
}