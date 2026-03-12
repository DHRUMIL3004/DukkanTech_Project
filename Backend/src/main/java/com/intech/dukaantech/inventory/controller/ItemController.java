package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    // ADD ITEM
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ItemResponse> addItem(
            @RequestPart("item") ItemRequest itemRequest,
            @RequestPart("file") MultipartFile file
    ) {
        ItemResponse response = itemService.add(itemRequest, file);
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