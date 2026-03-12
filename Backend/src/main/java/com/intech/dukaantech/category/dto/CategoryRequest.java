package com.intech.dukaantech.category.dto;

<<<<<<< HEAD
<<<<<<< HEAD
=======
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
>>>>>>> user-manage
public class CategoryRequest {

    private String name;
    private String description;
    private String bgColor;

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
