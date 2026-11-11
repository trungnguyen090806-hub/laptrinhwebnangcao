package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public List<Product> getProducts(String keyword, Long categoryId, String sort) {
        Sort sortOrder = Sort.by(Sort.Direction.DESC, "id");
        if ("asc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "price");
        } else if ("desc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "price");
        }

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasCategory = categoryId != null && categoryId > 0;

        if (hasKeyword && hasCategory) {
            return productRepository.findByNameContainingIgnoreCaseAndCategoryId(keyword.trim(), categoryId, sortOrder);
        } else if (hasKeyword) {
            return productRepository.findByNameContainingIgnoreCase(keyword.trim(), sortOrder);
        } else if (hasCategory) {
            return productRepository.findByCategoryId(categoryId, sortOrder);
        } else {
            return productRepository.findAll(sortOrder);
        }
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findTop8ByOrderByCreatedAtDesc();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    public Product createProduct(ProductRequest req) {
        Category category = categoryService.getCategoryById(req.getCategoryId());
        Product product = new Product(
                req.getName(),
                req.getPrice(),
                req.getStock(),
                req.getDescription(),
                req.getImageUrl(),
                category
        );
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest req) {
        Product product = getProductById(id);
        Category category = categoryService.getCategoryById(req.getCategoryId());

        product.setName(req.getName());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setDescription(req.getDescription());
        product.setImageUrl(req.getImageUrl());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm để xóa");
        }
        productRepository.deleteById(id);
    }
}
