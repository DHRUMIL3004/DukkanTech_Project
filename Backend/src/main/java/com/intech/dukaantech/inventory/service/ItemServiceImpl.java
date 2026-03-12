package com.intech.dukaantech.inventory.service;

import com.intech.dukaantech.category.model.Category;
import com.intech.dukaantech.category.repository.CategoryRepository;
import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.model.Item;
import com.intech.dukaantech.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ItemResponse add(ItemRequest itemRequest) {

        Category existingCategory = categoryRepository
                .findByCategoryId(itemRequest.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found : " + itemRequest.getCategoryId()));

        Item newItem = convertToEntity(itemRequest);

        newItem.setCategory(existingCategory);

        // temporary image
        newItem.setImgUrl("no-image");

        newItem = itemRepository.save(newItem);

        return convertToResponse(newItem);
    }

    private Item convertToEntity(ItemRequest itemRequest) {

        return Item.builder()
                .itemID(UUID.randomUUID().toString())
                .name(itemRequest.getName())
                .description(itemRequest.getDescription())
                .price(itemRequest.getPrice())
                .build();
    }

    private ItemResponse convertToResponse(Item item) {

        return ItemResponse.builder()
                .itemId(item.getItemID())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imgUrl(item.getImgUrl())
                .categoryName(item.getCategory().getName())
                .categoryId(item.getCategory().getCategoryId())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItem() {

        return itemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {

        Item existingItem = itemRepository.findByItemID(itemId)
                .orElseThrow(() ->
                        new RuntimeException("Item not found : " + itemId));

        itemRepository.delete(existingItem);
    }
}