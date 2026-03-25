package com.intech.dukaantech.category.mapper;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper {

    private final ModelMapper modelMapper;
    private final ItemRepository itemRepository;

    public Category mapToEntity(CategoryRequest request){
        return modelMapper.map(request, Category.class);
    }

    public CategoryResponse mapToResponse(Category entity){
        CategoryResponse response = modelMapper.map(entity, CategoryResponse.class);
        Integer count = itemRepository.countByCategory_CategoryId(entity.getCategoryId());
        response.setItemCount(count == null ? 0 : count);
        return response;
    }
}
