
package com.intech.dukaantech.category.controller;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.category.service.CategoryService;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/categories")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final ItemRepository itemRepository;

    // Create Category
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestPart("data") CategoryRequest request,
            @RequestPart("image") MultipartFile file) throws IOException {

        return ResponseEntity.ok(categoryService.createCategory(request, file));
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

    // searching
    @GetMapping("/search")
    public ResponseEntity<List<CategoryResponse>> searchCategory(
            @RequestParam String name){

        return ResponseEntity.ok(
                categoryService.searchCategoryByName(name));
    }

    // Update Category
    @PatchMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable String categoryId,
                                                           @RequestPart("data") @Valid CategoryRequest request,
                                                           @RequestPart(value = "image", required = false) MultipartFile file){

        return ResponseEntity.ok(categoryService.updateCategory(categoryId, request, file));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Integer> getItemCount(@PathVariable String categoryId){

        return ResponseEntity.ok(itemRepository.countByCategory_CategoryId(categoryId));
    }
}

