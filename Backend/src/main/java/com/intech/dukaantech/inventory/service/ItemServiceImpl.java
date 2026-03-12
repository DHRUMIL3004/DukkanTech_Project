package com.intech.dukaantech.inventory.service;

import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.category.repository.CategoryRepository;
import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;


    @Override
    public ItemResponse add(ItemRequest itemRequest, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        Item newItem = convertToEntity(itemRequest);
        Category existingCategory = categoryRepository.findByCategoryId(itemRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found : " + itemRequest.getCategoryId()));

        newItem.setCategory(existingCategory);
        newItem.setImgUrl(imgUrl);
        newItem = itemRepository.save(newItem);
        return convertToResponse(newItem);
    }

    private ItemResponse convertToResponse(Item newItem) {
        return ItemResponse.builder()
                .itemId(newItem.getItemID())
                .name(newItem.getName())
                .description(newItem.getDescription())
                .price(newItem.getPrice())
                .imgUrl(newItem.getImgUrl())
                .categoryName(newItem.getCategory().getName())
                .categoryId(newItem.getCategory().getCategoryId())
                .createdAt(newItem.getCreatedAt())
                .updatedAt(newItem.getUpdatedAt())
                .build();
    }

    private Item convertToEntity(ItemRequest itemRequest) {
        return Item.builder()
                .itemID(UUID.randomUUID().toString())
                .name(itemRequest.getName())
                .description(itemRequest.getDescription())
                .price(itemRequest.getPrice())
                .build();

    }


    @Override
    public List<ItemResponse> fetchItem() {
        return itemRepository.findAll()
                .stream()
                .map(item -> convertToResponse(item))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {

        Item existingItem = itemRepository.findByItemID(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found : " + itemId));

        boolean isFileDelete = fileUploadService.deleteFile(existingItem.getImgUrl());

        if (isFileDelete) {
            itemRepository.delete(existingItem);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error deleting file"
            );
        }
    }
}
