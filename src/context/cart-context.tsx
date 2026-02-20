"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { IProduct, IProductVariant } from "@/types";
import toast from "react-hot-toast";

interface CartItem {
  product: IProduct;
  variant?: IProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: IProduct, quantity?: number, variant?: IProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addToCart = useCallback(
    (product: IProduct, quantity: number = 1, variant?: IProductVariant) => {
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.variant?._id === variant?._id
        );

        if (existingItemIndex > -1) {
          // Update existing item
          const updatedItems = [...prevItems];
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
          
          // Check stock
          const maxStock = variant?.inventory || product.inventory.quantity;
          if (newQuantity > maxStock && product.inventory.trackInventory) {
            toast.error("Cannot add more items than available in stock");
            return prevItems;
          }

          updatedItems[existingItemIndex].quantity = newQuantity;
          toast.success(`Updated ${product.name} quantity in cart`);
          return updatedItems;
        } else {
          // Add new item
          toast.success(`Added ${product.name} to cart`);
          return [...prevItems, { product, variant, quantity }];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, variantId?: string) => {
      setItems((prevItems) => {
        const item = prevItems.find(
          (i) =>
            i.product._id === productId && i.variant?._id === variantId
        );
        if (item) {
          toast.success(`Removed ${item.product.name} from cart`);
        }
        return prevItems.filter(
          (item) =>
            !(item.product._id === productId && item.variant?._id === variantId)
        );
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (quantity < 1) {
        removeFromCart(productId, variantId);
        return;
      }

      setItems((prevItems) => {
        return prevItems.map((item) => {
          if (
            item.product._id === productId &&
            item.variant?._id === variantId
          ) {
            // Check stock
            const maxStock = item.variant?.inventory || item.product.inventory.quantity;
            if (quantity > maxStock && item.product.inventory.trackInventory) {
              toast.error("Cannot add more items than available in stock");
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        });
      });
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success("Cart cleared");
  }, []);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        tax,
        total,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}