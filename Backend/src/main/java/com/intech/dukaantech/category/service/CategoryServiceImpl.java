package com.intech.dukaantech.category.service;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.category.repository.CategoryRepository;
import com.intech.dukaantech.category.mapper.CategoryMapper;
import com.intech.dukaantech.common.exception.CategoryAlreadyExistsException;
import com.intech.dukaantech.common.exception.CategoryNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        if(categoryRepository.findByName(request.getName()).isPresent()){
            throw new CategoryAlreadyExistsException("Category already exists");
        }

        Category newCategory = categoryMapper.mapToEntity(request);

        newCategory.setCategoryId(UUID.randomUUID().toString());

        newCategory = categoryRepository.save(newCategory);

        return categoryMapper.mapToResponse(newCategory);
    }

    @Override
    public PageResponse<CategoryResponse> readCategories(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryResponse> categories = categoryPage.getContent()
                .stream()
                .map(categoryMapper::mapToResponse)
                .toList();

        return PageResponse.<CategoryResponse>builder()
                .page(categoryPage.getNumber())
                .size(categoryPage.getSize())
                .totalPages(categoryPage.getTotalPages())
                .totalElements(categoryPage.getTotalElements())
                .data(categories)
                .build();
    }

    @Override
    public void deleteCategory(String categoryId) {

        log.info("Deleting category with id: {}", categoryId);

        Category category = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        categoryRepository.delete(category);

        log.info("Category deleted successfully: {}", categoryId);
    }
}
