package com.intech.dukaantech.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemResponse {

    private String itemId;
    private String name;
    private String categoryId;
    private BigDecimal price;
    private Long quantity;
    private String description;
    private String categoryName;
    private String imgUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}