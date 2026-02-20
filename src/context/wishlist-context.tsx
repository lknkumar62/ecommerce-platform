"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { IProduct } from "@/types";
import toast from "react-hot-toast";

interface WishlistContextType {
  items: IProduct[];
  addToWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: IProduct) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addToWishlist = useCallback((product: IProduct) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item._id === product._id);
      if (exists) {
        toast.success(`${product.name} is already in your wishlist`);
        return prevItems;
      }
      toast.success(`Added ${product.name} to wishlist`);
      return [...prevItems, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i._id === productId);
      if (item) {
        toast.success(`Removed ${item.name} from wishlist`);
      }
      return prevItems.filter((item) => item._id !== productId);
    });
  }, []);

  const toggleWishlist = useCallback(
    (product: IProduct) => {
      const exists = items.some((item) => item._id === product._id);
      if (exists) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist(product);
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((item) => item._id === productId);
    },
    [items]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    toast.success("Wishlist cleared");
  }, []);

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}