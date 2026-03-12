package com.intech.dukaantech.category.mapper;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.category.model.Category;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper {

    private final ModelMapper modelMapper;

    public Category mapToEntity(CategoryRequest request){
        return modelMapper.map(request, Category.class);
    }

    public CategoryResponse mapToResponse(Category entity){
        return modelMapper.map(entity, CategoryResponse.class);
    }
}