package com.intech.dukaantech.inventory.repository;

import com.intech.dukaantech.inventory.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByItemID(String itemID);

    Integer countByCategory_CategoryId(String categoryId);

}