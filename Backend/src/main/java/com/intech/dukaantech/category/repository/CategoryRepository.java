package com.intech.dukaantech.category.repository;

import com.intech.dukaantech.category.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository <Category, Long>{

    Optional<Category> findByName(String name);

    Optional<Category> findByCategoryId(String categoryId);

    List<Category> findByNameContainingIgnoreCase(String name);

    Boolean existsByNameContainingIgnoreCase(String name);
}
