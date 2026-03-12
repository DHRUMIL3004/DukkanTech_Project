package com.intech.dukaantech.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemRequest {

    private String name;
    private String categoryId;
    private BigDecimal price;
    private String description;

}