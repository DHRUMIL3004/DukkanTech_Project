package com.intech.dukaantech.category.dto;

<<<<<<< HEAD
public class CategoryResponse {
}
=======
import lombok.Builder;
import lombok.Data;

import java.sql.Time;
import java.sql.Timestamp;

@Data
@Builder
public class CategoryResponse {

    private String categoryId;
    private String name;
    private String description;
    private String bgColor;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String imgUrl;

}
>>>>>>> Manage_item
