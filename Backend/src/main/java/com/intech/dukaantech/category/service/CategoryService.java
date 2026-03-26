
package com.intech.dukaantech.category.service;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request, MultipartFile file);

    PageResponse<CategoryResponse> readCategories(int page, int size);

    void deleteCategory(String categoryId);

    List<CategoryResponse> searchCategoryByName(String name);

    CategoryResponse updateCategory(String categoryId, CategoryRequest request, MultipartFile file);



}
