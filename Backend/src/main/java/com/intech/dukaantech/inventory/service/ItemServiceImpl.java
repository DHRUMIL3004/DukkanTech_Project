package com.intech.dukaantech.inventory.service;

import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.category.repository.CategoryRepository;
import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.common.exception.custom.DuplicateResourceException;
import com.intech.dukaantech.common.exception.custom.ResourceNotFoundException;
import com.intech.dukaantech.common.exception.custom.TypeNotPresentException;
import com.intech.dukaantech.common.service.S3Service;
import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.mapper.ItemMapper;
import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final ItemMapper itemMapper;
    private final S3Service s3Service;

    // Creating Item
    @Override
    public ItemResponse add(ItemRequest itemRequest, MultipartFile file) {

        log.info("Adding new item: {}", itemRequest.getName());

        Category category = categoryRepository
                .findByCategoryId(itemRequest.getCategoryId())
                .orElseThrow(() -> {
                    log.warn("Category Already Exists: {}", itemRequest.getCategoryId());
                    return new DuplicateResourceException("Category Already Exists");
                });

        if (file == null || file.isEmpty()) {
            log.warn("Image file missing for item: {}", itemRequest.getName());
            throw new ResourceNotFoundException("Image file is required");
        }

        if (!file.getContentType().startsWith("image/")) {
            log.warn("Invalid image type: {}", file.getContentType());
            throw new TypeNotPresentException("Only image files allowed");
        }

        Item newItem = itemMapper.mapToEntity(itemRequest);

        newItem.setItemID(UUID.randomUUID().toString());
        newItem.setCategory(category);

        String imgUrl = s3Service.uploadFile(file);
        newItem.setImgUrl(imgUrl);

        newItem = itemRepository.save(newItem);

        log.info("Item created successfully with id: {}", newItem.getItemID());

        return itemMapper.mapToResponse(newItem);
    }

    // Fetching Items

    @Override
    public PageResponse<ItemResponse> fetchItem(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Item> itemPage = itemRepository.findAll(pageable);

        List<ItemResponse> items = itemPage.getContent()
                .stream()
                .map(itemMapper::mapToResponse)
                .toList();

        return PageResponse.<ItemResponse>builder()
                .page(itemPage.getNumber())
                .size(itemPage.getSize())
                .totalPages(itemPage.getTotalPages())
                .totalElements(itemPage.getTotalElements())
                .data(items)
                .build();
    }

    // Delete Item
    @Override
    public void deleteItem(String itemId) {

        log.info("Deleting item: {}", itemId);

        Item existingItem = itemRepository.findByItemID(itemId)
                .orElseThrow(() -> {
                    log.warn("Item not found: {}", itemId);
                    return new ResourceNotFoundException("Item not found");
                });

        itemRepository.delete(existingItem);

        log.info("Item deleted successfully: {}", itemId);
    }

    @Override
    public ItemResponse updateQuantity(String itemId, Long quantity) {

        log.info("Updating quantity for item: {} with quantity: {}", itemId, quantity);

        if (quantity == null || quantity < 0) {
            throw new RuntimeException("Quantity must be non-negative");
        }

        Item item = itemRepository.findByItemID(itemId)
                .orElseThrow(() -> {
                    log.warn("Item not found: {}", itemId);
                    return new ResourceNotFoundException("Item not found");
                });

        item.setQuantity(quantity);
        item = itemRepository.save(item);

        return itemMapper.mapToResponse(item);
    }

    @Override
    public List<Item> getLowStockItems() {
        return itemRepository.findByQuantityLessThan(2);
    }

    @Override
    public ItemResponse updateItem(String itemId, ItemRequest request, MultipartFile file){

        log.info("Updating item: {}", itemId);

        Item updateItem = itemRepository.findByItemID(itemId)
                .orElseThrow(()-> new ResourceNotFoundException("Item not found"));

        Category category = categoryRepository
                .findByCategoryId(request.getCategoryId())
                .orElseThrow(() -> {
                    log.warn("Category not found: {}", request.getCategoryId());
                    return new ResourceNotFoundException("Category not found");
                });

        if (request.getQuantity() < 0) {
            throw new RuntimeException("Quantity must be non-negative");
        }

        if (!updateItem.getName().equals(request.getName()) && itemRepository.existsByNameContainingIgnoreCase(request.getName())){
            throw new DuplicateResourceException("Item Exists Already");
        }

        if (file != null && !file.isEmpty()){

            // delete old image
            s3Service.deleteFile(updateItem.getImgUrl());

            // upload new image
            String newImageUrl = s3Service.uploadFile(file);
            updateItem.setImgUrl(newImageUrl);
        }

        updateItem.setName(request.getName());
        updateItem.setCategory(category);
        updateItem.setPrice(request.getPrice());
        updateItem.setDescription(request.getDescription());
        updateItem.setQuantity(request.getQuantity());

        updateItem = itemRepository.save(updateItem);

        return itemMapper.mapToResponse(updateItem);
    }
}