package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse> addItem(@RequestBody ItemRequest itemRequest) {

        ItemResponse response = itemService.add(itemRequest);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems() {

        return ResponseEntity.ok(itemService.fetchItem());
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable String itemId) {

        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}