package com.intech.dukaantech.billing.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;


import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "tbl_orders")
@Data
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String orderId;

    private String customerName;

    private String phone;

    private BigDecimal subTotal;

    private BigDecimal totalTax;

    private BigDecimal totalAmount;

    private String paymentMethod;

    @OneToMany(mappedBy = "bill" , cascade = CascadeType.ALL)

   private List<OrderItem> items;

    private boolean paid;

    @CreationTimestamp
    private Timestamp createdAt;

}
