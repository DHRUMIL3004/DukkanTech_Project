package com.intech.dukaantech.inventory.service;

import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.model.Item;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {

   ItemResponse add(ItemRequest itemRequest, MultipartFile file);

   PageResponse<ItemResponse> fetchItem(int page, int size);

   void deleteItem(String itemId);

   ItemResponse updateQuantity(String itemId, Long quantity);

   List<Item>getLowStockItems();

   ItemResponse updateItem(String itemId, ItemRequest request, MultipartFile file);


}