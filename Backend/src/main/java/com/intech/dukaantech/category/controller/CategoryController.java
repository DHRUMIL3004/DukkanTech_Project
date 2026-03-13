package com.intech.dukaantech.category.controller;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.category.service.CategoryService;
import com.intech.dukaantech.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Create Category
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestPart("data") String data,
            @RequestPart("image") MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        CategoryRequest request = mapper.readValue(data, CategoryRequest.class);

        CategoryResponse response =
                categoryService.createCategory(request, file);

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

    // searching
    @GetMapping("/search")
    public ResponseEntity<List<CategoryResponse>> searchCategory(
            @RequestParam String name){

        return ResponseEntity.ok(
                categoryService.searchCategoryByName(name));
    }
}
