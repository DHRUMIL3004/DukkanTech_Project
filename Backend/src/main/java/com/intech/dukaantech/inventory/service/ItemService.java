package com.intech.dukaantech.inventory.service;

import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;

import java.util.List;

public interface ItemService {

   ItemResponse add(ItemRequest itemRequest);

   List<ItemResponse> fetchItem();

   void deleteItem(String itemId);
}