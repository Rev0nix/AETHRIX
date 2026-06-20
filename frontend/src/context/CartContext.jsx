import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const CartContext = createContext(null);

const STORAGE_KEY = 'aethrix_cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, qty = 1, size = null, color = null) => {
    setCart((prev) => {
      const key = `${product._id}-${size || ''}-${color || ''}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          product: product._id,
          name: product.name,
          image: product.images?.[0]?.url || '',
          price: product.price,
          qty,
          size,
          color,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((i) => i.key !== key);
      return prev.map((i) => (i.key === key ? { ...i, qty } : i));
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
    setDiscount(0);
  }, []);

  const applyCoupon = useCallback((code, discountAmount) => {
    setCouponCode(code);
    setDiscount(discountAmount);
  }, []);

  const itemsPrice = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const shippingPrice = itemsPrice >= 999 || itemsPrice === 0 ? 0 : 99;
  const totalPrice = Math.max(itemsPrice + shippingPrice - discount, 0);
  const itemCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        applyCoupon,
        couponCode,
        discount,
        itemsPrice,
        shippingPrice,
        totalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
