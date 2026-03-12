package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    // ADD ITEM
    @PostMapping
    public ResponseEntity<ItemResponse> addItem(@RequestBody ItemRequest itemRequest) {

        ItemResponse response = itemService.add(itemRequest);
        return ResponseEntity.ok(response);
    }

    // GET ALL ITEMS
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems() {

        return ResponseEntity.ok(itemService.fetchItem());
    }

    // DELETE ITEM
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable String itemId) {

        itemService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }
}