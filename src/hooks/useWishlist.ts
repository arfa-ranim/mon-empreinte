"use client";

import { useState, useEffect } from "react";

export function useWishlist() {
  // Initialize with a function to read from localStorage (lazy initialization)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    // This runs only once during the initial render
    if (typeof window === "undefined") return [];
    
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // Ignore parsing errors
    }
    return [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch {
      // Ignore storage errors
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
  };

  return { wishlist, toggleWishlist, isInWishlist, clearWishlist };
}