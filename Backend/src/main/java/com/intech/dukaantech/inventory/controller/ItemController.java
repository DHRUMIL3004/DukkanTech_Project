package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    // Create
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponse> addItem(
            @RequestPart("data") @Valid ItemRequest request,
            @RequestPart(value = "image", required = true) MultipartFile file) throws IOException {

        return ResponseEntity.ok(itemService.add(request, file));
    }

    // Fetch
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @GetMapping
    public ResponseEntity<PageResponse<ItemResponse>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(itemService.fetchItem(page, size));
    }

    // Delete
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable String itemId) {

        itemService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }

    // Update
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{itemId}")
    public ResponseEntity<ItemResponse> updateItem(@PathVariable String itemId,
                                             @RequestPart("data") @Valid ItemRequest request,
                                             @RequestPart(value = "image", required = false) MultipartFile file){
        return ResponseEntity.ok(itemService.updateItem(itemId, request, file));
    }

    // Update quantity (used by billing flow)
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @PatchMapping("/{itemId}/quantity")
    public ResponseEntity<ItemResponse> updateQuantity(@PathVariable String itemId,
                                                       @RequestParam Long quantity) {
        return ResponseEntity.ok(itemService.updateQuantity(itemId, quantity));
    }


}