package com.intech.dukaantech.billing.dto;

import com.intech.dukaantech.billing.model.OrderItem;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BillingRequest {

    private String customerName;
    private String phone;
    private String city;
    private LocalDate dob;
    private String paymentMethod;


    private List<OrderItemRequest> items;


}
