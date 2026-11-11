package com.ecommerce.dto;

import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private Product product;
    private Integer quantity;
    private BigDecimal subtotal;

    public CartItemResponse() {}

    public CartItemResponse(CartItem item) {
        this.id = item.getId();
        this.product = item.getProduct();
        this.quantity = item.getQuantity();
        if (item.getProduct() != null && item.getProduct().getPrice() != null) {
            this.subtotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        } else {
            this.subtotal = BigDecimal.ZERO;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
