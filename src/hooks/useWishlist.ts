"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "wishlist";

const EMPTY_WISHLIST: string[] = [];

let cachedWishlist = EMPTY_WISHLIST;


function getWishlist() {
  return cachedWishlist;
}


function updateWishlistCache() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      cachedWishlist = EMPTY_WISHLIST;
      return;
    }

    const parsed = JSON.parse(saved);

    cachedWishlist = Array.isArray(parsed)
      ? parsed
      : EMPTY_WISHLIST;

  } catch {
    cachedWishlist = EMPTY_WISHLIST;
  }
}


function subscribe(callback: () => void) {
  window.addEventListener("wishlist-change", callback);

  return () => {
    window.removeEventListener("wishlist-change", callback);
  };
}


function getServerSnapshot() {
  return EMPTY_WISHLIST;
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


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );


    window.dispatchEvent(
      new Event("wishlist-change")
    );
  };


  const clearWishlist = () => {

    cachedWishlist = EMPTY_WISHLIST;

    localStorage.removeItem(STORAGE_KEY);

    window.dispatchEvent(
      new Event("wishlist-change")
    );
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