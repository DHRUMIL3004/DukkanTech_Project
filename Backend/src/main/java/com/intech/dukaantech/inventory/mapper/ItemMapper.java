package com.intech.dukaantech.inventory.mapper;

import com.intech.dukaantech.inventory.dto.ItemRequest;
import com.intech.dukaantech.inventory.dto.ItemResponse;
import com.intech.dukaantech.inventory.model.Item;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ItemMapper {

    private final ModelMapper modelMapper;

    public Item mapToEntity(ItemRequest request){
        // Manual mapping to avoid ModelMapper trying to convert String UUIDs to Long IDs
        return Item.builder()
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .quantity((request.getQuantity()))

                // id, itemID and category are set explicitly in the service layer
                .build();
    }

    public ItemResponse mapToResponse(Item entity){

        ItemResponse response = modelMapper.map(entity, ItemResponse.class);

        response.setItemId(entity.getItemID());
        response.setCategoryId(entity.getCategory().getCategoryId());
        response.setCategoryName(entity.getCategory().getName());
      
         response.setTax(entity.getCategory().getTax());

        return response;
    }
}