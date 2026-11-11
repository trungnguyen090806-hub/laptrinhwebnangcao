package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(userId);

        List<CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        int totalQty = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                CartItemResponse itemResp = new CartItemResponse(item);
                itemResponses.add(itemResp);
                total = total.add(itemResp.getSubtotal());
                totalQty += itemResp.getQuantity();
            }
        }

        response.setItems(itemResponses);
        response.setTotalAmount(total);
        response.setTotalQuantity(totalQty);
        return response;
    }

    @Transactional
    public CartResponse addToCart(AddToCartRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        if (product.getStock() < req.getQuantity()) {
            throw new RuntimeException("Số lượng tồn kho không đủ (Hiện còn: " + product.getStock() + ")");
        }

        Cart cart = getOrCreateCart(req.getUserId());
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + req.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new RuntimeException("Số lượng thêm vào giỏ vượt quá số lượng tồn kho");
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, req.getQuantity());
            cartItemRepository.save(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return getCart(req.getUserId());
    }

    @Transactional
    public CartResponse updateItemQuantity(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Món hàng không tồn tại trong giỏ"));

        if (quantity <= 0) {
            Long userId = item.getCart().getUser().getId();
            cartItemRepository.delete(item);
            return getCart(userId);
        }

        if (item.getProduct().getStock() < quantity) {
            throw new RuntimeException("Số lượng yêu cầu (" + quantity + ") vượt quá tồn kho (" + item.getProduct().getStock() + ")");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return getCart(item.getCart().getUser().getId());
    }

    @Transactional
    public CartResponse removeItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Món hàng không tồn tại trong giỏ"));
        Long userId = item.getCart().getUser().getId();
        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }
}
