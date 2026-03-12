package com.intech.dukaantech.category.controller;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.category.service.CategoryService;
import com.intech.dukaantech.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Create Category
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request){

        CategoryResponse response = categoryService.createCategory(request);

        return ResponseEntity.ok(response);
    }

    // fetch categories
    @GetMapping
    public ResponseEntity<PageResponse<CategoryResponse>> readCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size){

        return ResponseEntity.ok(categoryService.readCategories(page, size));
    }

    // Delete Category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable String categoryId){

        categoryService.deleteCategory(categoryId);

        return ResponseEntity.ok("Category deleted successfully");
    }
}
