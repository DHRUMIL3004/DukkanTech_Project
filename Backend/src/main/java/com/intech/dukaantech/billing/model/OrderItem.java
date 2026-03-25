package com.intech.dukaantech.billing.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "tbl_OrderItems")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private BigDecimal price;
    private int quantity;

    private BigDecimal tax;
    private BigDecimal taxAmount;
    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "order_id")

    private Bill bill;

}
