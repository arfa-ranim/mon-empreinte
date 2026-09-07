import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useWishlist', () => {
  // Reset modules and localStorage before each test
  beforeEach(async () => {
    vi.resetModules();
    // Clear the in-memory store
    localStorage.clear();
    // Reset mock calls if needed
    vi.mocked(localStorage.getItem).mockClear();
    vi.mocked(localStorage.setItem).mockClear();
    vi.mocked(localStorage.removeItem).mockClear();
  });

  it('should initialize with empty wishlist', async () => {
    const { useWishlist } = await import('./useWishlist');
    const { result } = renderHook(() => useWishlist());
    expect(result.current.wishlist).toEqual([]);
  });

  it('should toggle a product ID', async () => {
    const { useWishlist } = await import('./useWishlist');
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlist('1'));
    expect(result.current.wishlist).toContain('1');
    act(() => result.current.toggleWishlist('1'));
    expect(result.current.wishlist).not.toContain('1');
  });

  it('should check if product is in wishlist', async () => {
    const { useWishlist } = await import('./useWishlist');
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlist('2'));
    expect(result.current.isInWishlist('2')).toBe(true);
    expect(result.current.isInWishlist('3')).toBe(false);
  });

  it('should clear wishlist', async () => {
    const { useWishlist } = await import('./useWishlist');
    const { result } = renderHook(() => useWishlist());
    act(() => result.current.toggleWishlist('1'));
    act(() => result.current.clearWishlist());
    expect(result.current.wishlist).toEqual([]);
  });
});