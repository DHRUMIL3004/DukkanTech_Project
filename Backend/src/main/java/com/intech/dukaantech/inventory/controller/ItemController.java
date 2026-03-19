package com.intech.dukaantech.inventory.controller;

import com.intech.dukaantech.common.dto.PageResponse;
import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponse> addItem(
            @RequestPart("data") String data,
            @RequestPart("image") MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        ItemRequest request = mapper.readValue(data, ItemRequest.class);

        ItemResponse response = itemService.add(request,file);

        return ResponseEntity.status(201).body(response);
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @GetMapping
    public ResponseEntity<PageResponse<ItemResponse>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(itemService.fetchItem(page, size));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable String itemId) {

        itemService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{itemId}")
    public ResponseEntity<String> updateQuantity(@PathVariable String itemId,
                                                 @RequestParam Long quantity){

        itemService.updateQuantity(itemId, quantity);

        return ResponseEntity.ok("Item Quantity Updated");
    }
}