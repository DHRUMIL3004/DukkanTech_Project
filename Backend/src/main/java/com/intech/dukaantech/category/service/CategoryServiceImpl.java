
package com.intech.dukaantech.category.service;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.category.repository.CategoryRepository;
import com.intech.dukaantech.category.mapper.CategoryMapper;
import com.intech.dukaantech.common.exception.ApiException;
import com.intech.dukaantech.common.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final S3Service s3Service;

    // Creating Categories
    @Override
    public CategoryResponse createCategory(CategoryRequest request, MultipartFile file) {

        // check is category exists
        if(categoryRepository.findByName(request.getName()).isPresent()){
            throw new ApiException("Category already exists", HttpStatus.BAD_REQUEST);
        }

        // check file is not empty
        if(file.isEmpty()){
            throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
        }

        // file is not image type
        if(!file.getContentType().startsWith("image/")){
            throw new ApiException("Only image files are allowed", HttpStatus.BAD_REQUEST);
        }

        Category newCategory = categoryMapper.mapToEntity(request);

        String imgUrl = s3Service.uploadFile(file);
        newCategory.setImgUrl(imgUrl);
        newCategory.setCategoryId(UUID.randomUUID().toString());

        newCategory = categoryRepository.save(newCategory);

        return categoryMapper.mapToResponse(newCategory);
    }

    // Fetching Categories
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
                .orElseThrow(() ->
                        new ApiException("Category not found", HttpStatus.NOT_FOUND));

        if(category.getImgUrl() != null){
            s3Service.deleteFile(category.getImgUrl());
        }

        categoryRepository.delete(category);

        log.info("Category deleted successfully: {}", categoryId);
    }

    // search users
    @Override
    public List<CategoryResponse> searchCategoryByName(String name) {

        List<Category> categories =
                categoryRepository.findByNameContainingIgnoreCase(name);

        return categories.stream()
                .map(categoryMapper::mapToResponse)
                .toList();
    }

    // Update Category
    public CategoryResponse updateCategory(String categoryId, CategoryRequest request, MultipartFile file){

        Category updateCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(()->new ApiException("Category not found",HttpStatus.NOT_FOUND));

        if (!updateCategory.getName().equals(request.getName()) && categoryRepository.existsByNameContainingIgnoreCase(request.getName())){
            throw new ApiException("Category Already Exists",HttpStatus.NOT_ACCEPTABLE);
        }

        if (file != null && !file.isEmpty()){

            // delete old image
            s3Service.deleteFile(updateCategory.getImgUrl());

            // upload new image
            String newImageUrl = s3Service.uploadFile(file);
            updateCategory.setImgUrl(newImageUrl);
        }

        updateCategory.setName(request.getName());
        updateCategory.setDescription(request.getDescription());
        updateCategory.setBgColor(request.getBgColor());
        updateCategory.setTax(request.getTax());

        updateCategory = categoryRepository.save(updateCategory);

        return categoryMapper.mapToResponse(updateCategory);
    }
}
