"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "wishlist";
const EMPTY_WISHLIST: string[] = [];

let cachedWishlist = EMPTY_WISHLIST;

// Get current wishlist from cache
function getWishlist() {
  return cachedWishlist;
}

// Subscribe to storage events
function subscribe(callback: () => void) {
  // Listen for both custom events and storage events (for multi-tab sync)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      // Update cache when storage changes
      updateWishlistCache();
      callback();
    }
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener("wishlist-change", handleCustomEvent);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("wishlist-change", handleCustomEvent);
    window.removeEventListener("storage", handleStorageChange);
  };
}

// Update cache from localStorage
function updateWishlistCache() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      cachedWishlist = EMPTY_WISHLIST;
      return;
    }
    const parsed = JSON.parse(saved);
    cachedWishlist = Array.isArray(parsed) ? parsed : EMPTY_WISHLIST;
  } catch {
    cachedWishlist = EMPTY_WISHLIST;
  }
}

// Server snapshot for SSR
function getServerSnapshot() {
  return EMPTY_WISHLIST;
}

// Initialize cache on module load (client-side only)
if (typeof window !== "undefined") {
  updateWishlistCache();
}

export function useWishlist() {
  const wishlist = useSyncExternalStore(
    subscribe,
    getWishlist,
    getServerSnapshot
  );

  const toggleWishlist = (productId: string) => {
    const current = cachedWishlist;
    const updated = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    cachedWishlist = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist-change"));
  };

  const clearWishlist = () => {
    cachedWishlist = EMPTY_WISHLIST;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("wishlist-change"));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  };
}