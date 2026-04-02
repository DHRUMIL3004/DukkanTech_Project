
package com.intech.dukaantech.category.service;

import com.intech.dukaantech.category.dto.CategoryRequest;
import com.intech.dukaantech.category.dto.CategoryResponse;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.category.repository.CategoryRepository;
import com.intech.dukaantech.category.mapper.CategoryMapper;
import com.intech.dukaantech.common.exception.custom.DuplicateResourceException;
import com.intech.dukaantech.common.exception.custom.ResourceNotFoundException;
import com.intech.dukaantech.common.exception.custom.TypeNotPresentException;
import com.intech.dukaantech.common.service.S3Service;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

import static com.intech.dukaantech.category.model.QCategory.category;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final S3Service s3Service;
    private final JPAQueryFactory queryFactory;

    // Creating Categories
    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, MultipartFile file) {

        // check is category exists
        if(categoryRepository.findByName(request.getName()).isPresent()){
            throw new DuplicateResourceException("Category already exists");
        }

        // check file is not empty
        if(file.isEmpty()){
            throw new ResourceNotFoundException("File is empty");
        }

        // file is not image type
        if(!file.getContentType().startsWith("image/")){
            throw new TypeNotPresentException("Only image files are allowed");
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
    @Transactional(readOnly = true)
        public PageResponse<CategoryResponse> fetchCategories(int page, int size, String search, String sortBy, String sortDir) {

        BooleanBuilder where = new BooleanBuilder();

        if (search != null && !search.isBlank()) {
            where.and(
                category.name.containsIgnoreCase(search)
                    .or(category.tax.stringValue().contains(search))
            );
        }

        OrderSpecifier<?> orderSpecifier = null;
        if (sortBy != null && !sortBy.isBlank()) {
            Order direction = "DESC".equalsIgnoreCase(sortDir) ? Order.DESC : Order.ASC;
            orderSpecifier = "tax".equalsIgnoreCase(sortBy)
                ? new OrderSpecifier<>(direction, category.tax)
                : new OrderSpecifier<>(direction, category.name);
        }

        var query = queryFactory
            .selectFrom(category)
            .where(where);

        if (orderSpecifier != null) {
            query.orderBy(orderSpecifier);
        }

        List<Category> categoryList = query
            .offset((long) page * size)
            .limit(size)
            .fetch();

        Long totalElements = queryFactory
            .select(category.count())
            .from(category)
            .where(where)
            .fetchOne();

        long safeTotal = totalElements == null ? 0L : totalElements;

        List<CategoryResponse> categories = categoryList
            .stream()
            .map(categoryMapper::mapToResponse)
            .toList();

        return PageResponse.<CategoryResponse>builder()
            .page(page)
            .size(size)
            .totalPages((int) Math.ceil((double) safeTotal / size))
            .totalElements(safeTotal)
                .data(categories)
                .build();
    }

    @Override
    @Transactional
    public void deleteCategory(String categoryId) {

        log.info("Deleting category with id: {}", categoryId);

        Category category = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() ->
                new ResourceNotFoundException("Category not found"));

        if(category.getImgUrl() != null){
            s3Service.deleteFile(category.getImgUrl());
        }

        categoryRepository.delete(category);

        log.info("Category deleted successfully: {}", categoryId);
    }

    // Update Category
    @Transactional
    public CategoryResponse updateCategory(String categoryId, CategoryRequest request, MultipartFile file){

        Category updateCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category not found"));

        if (!updateCategory.getName().equals(request.getName()) && categoryRepository.existsByNameContainingIgnoreCase(request.getName())){
            throw new DuplicateResourceException("Category Already Exists");
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
