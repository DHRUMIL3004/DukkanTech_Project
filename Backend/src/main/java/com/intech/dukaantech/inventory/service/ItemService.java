package com.intech.dukaantech.inventory.service;

import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {

   ItemResponse add(ItemRequest itemRequest, MultipartFile file);

   List<ItemResponse> fetchItem();

   void deleteItem(String itemId);

    void updateQuantity(String itemId, Long quantity);
}