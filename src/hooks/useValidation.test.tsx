import { vi } from 'vitest'; // ✅ Add this line (if needed, though not used directly)
import { renderHook, act } from '@testing-library/react';
import { useValidation } from './useValidation';

describe('useValidation', () => {
  const rules = {
    name: { required: true, minLength: 2 },
    age: { min: 18, max: 99 },
  };

  it('should validate required field', () => {
    const { result } = renderHook(() => useValidation({ name: '', age: 20 }, rules));
    act(() => result.current.validateAll());
    expect(result.current.errors.name).toBeTruthy();
  });

  it('should validate minLength', () => {
    const { result } = renderHook(() => useValidation({ name: 'A', age: 20 }, rules));
    act(() => result.current.validateAll());
    expect(result.current.errors.name).toContain('Minimum');
  });
});