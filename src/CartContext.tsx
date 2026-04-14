import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Burger } from "./types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (burger: Burger) => void;
  removeFromCart: (burgerId: string) => void;
  updateQuantity: (burgerId: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("burger-cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("burger-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (burger: Burger) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === burger.id);
      if (existing) {
        return prev.map((item) =>
          item.id === burger.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...burger, quantity: 1 }];
    });
  };

  const removeFromCart = (burgerId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== burgerId));
  };

  const updateQuantity = (burgerId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === burgerId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
