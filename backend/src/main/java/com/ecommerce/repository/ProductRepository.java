package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId, Sort sort);
    List<Product> findByNameContainingIgnoreCase(String keyword, Sort sort);
    List<Product> findByNameContainingIgnoreCaseAndCategoryId(String keyword, Long categoryId, Sort sort);
    List<Product> findTop8ByOrderByCreatedAtDesc();
}
