// src/app/api/products/[id]/route.test.ts (fixed)
import { GET } from './route';
import { prisma } from '@/lib/prisma';
import { vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('GET /api/products/[id]', () => {
  it('should return a product by id', async () => {
    const mockProduct = { id: '1', title: 'Test' };
    vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct);

    const request = new Request('http://localhost/api/products/1');
    const params = Promise.resolve({ id: '1' }); // ✅ Provide the required params

    const response = await GET(request, { params });
    const json = await response.json();
    expect(json).toEqual(mockProduct);
  });
});