import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalQuantity: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!currentUser || !currentUser.id) {

      const savedCart = localStorage.getItem('techstore_guest_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart({ items: [], totalAmount: 0, totalQuantity: 0 });
      }
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart(currentUser.id);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product, quantity = 1) => {
    if (currentUser && currentUser.id) {
      try {
        const res = await cartService.addToCart(currentUser.id, product.id, quantity);
        if (res.success && res.data) {
          setCart(res.data);
          return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' };
        }
        return { success: false, message: res.message || 'Không thể thêm vào giỏ' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {

      const currentItems = [...cart.items];
      const existingIdx = currentItems.findIndex(i => i.product.id === product.id);

      if (existingIdx > -1) {
        const newQty = currentItems[existingIdx].quantity + quantity;
        if (product.stock < newQty) {
          return { success: false, message: `Số lượng vượt quá tồn kho (Hiện còn: ${product.stock})` };
        }
        currentItems[existingIdx].quantity = newQty;
        currentItems[existingIdx].subtotal = product.price * newQty;
      } else {
        if (product.stock < quantity) {
          return { success: false, message: `Số lượng vượt quá tồn kho (Hiện còn: ${product.stock})` };
        }
        currentItems.push({
          id: Date.now(), 
          product,
          quantity,
          subtotal: product.price * quantity,
        });
      }

      const totalAmount = currentItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
      const totalQuantity = currentItems.reduce((sum, item) => sum + item.quantity, 0);
      const newCart = { items: currentItems, totalAmount, totalQuantity };

      setCart(newCart);
      localStorage.setItem('techstore_guest_cart', JSON.stringify(newCart));
      return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (currentUser && currentUser.id) {
      try {
        const res = await cartService.updateItemQuantity(itemId, quantity);
        if (res.success && res.data) {
          setCart(res.data);
          return { success: true };
        }
        return { success: false, message: res.message };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      let currentItems = [...cart.items];
      if (quantity <= 0) {
        currentItems = currentItems.filter(i => i.id !== itemId);
      } else {
        const item = currentItems.find(i => i.id === itemId);
        if (item) {
          if (item.product.stock < quantity) {
            return { success: false, message: `Số lượng vượt quá tồn kho (${item.product.stock})` };
          }
          item.quantity = quantity;
          item.subtotal = item.product.price * quantity;
        }
      }

      const totalAmount = currentItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
      const totalQuantity = currentItems.reduce((sum, item) => sum + item.quantity, 0);
      const newCart = { items: currentItems, totalAmount, totalQuantity };

      setCart(newCart);
      localStorage.setItem('techstore_guest_cart', JSON.stringify(newCart));
      return { success: true };
    }
  };

  const removeItem = async (itemId) => {
    if (currentUser && currentUser.id) {
      try {
        const res = await cartService.removeItem(itemId);
        if (res.success && res.data) {
          setCart(res.data);
          return { success: true };
        }
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      const currentItems = cart.items.filter(i => i.id !== itemId);
      const totalAmount = currentItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
      const totalQuantity = currentItems.reduce((sum, item) => sum + item.quantity, 0);
      const newCart = { items: currentItems, totalAmount, totalQuantity };

      setCart(newCart);
      localStorage.setItem('techstore_guest_cart', JSON.stringify(newCart));
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (currentUser && currentUser.id) {
      try {
        await cartService.clearCart(currentUser.id);
      } catch (err) {
        console.error(err);
      }
    }
    setCart({ items: [], totalAmount: 0, totalQuantity: 0 });
    localStorage.removeItem('techstore_guest_cart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
