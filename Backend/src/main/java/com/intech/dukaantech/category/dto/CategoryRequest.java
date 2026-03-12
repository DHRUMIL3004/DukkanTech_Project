package com.intech.dukaantech.category.dto;

<<<<<<< HEAD
public class CategoryRequest {
}
=======
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CategoryRequest {

    private String name;
    private String description;
    private String bgColor;

}
>>>>>>> Manage_item
