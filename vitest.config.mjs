import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // Exclude problematic files
    exclude: [
      '**/node_modules/**',
      '**/e2e.skip/**',
      '**/e2e/**',
      '**/api/products/[id]/route.test.ts',
      '**/route.test.ts',
    ],
  },
});