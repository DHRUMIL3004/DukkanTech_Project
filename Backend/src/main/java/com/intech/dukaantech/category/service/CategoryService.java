
package com.intech.dukaantech.category.service;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.common.dto.PageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request, MultipartFile file);

    PageResponse<CategoryResponse> fetchCategories(int page, int size, String search, String sortBy, String sortDir);

    void deleteCategory(String categoryId);

    CategoryResponse updateCategory(String categoryId, CategoryRequest request, MultipartFile file);



}
