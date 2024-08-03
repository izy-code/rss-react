import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      all: true,
      exclude: [
        'src/test/**/*',
        '**/types.ts',
        '**/types/*',
        '**/*.d.ts',
        '**/index.ts',
        'src/config/**/*',
        'src/**/*/enums.ts',
      ],
      extension: ['.ts', '.tsx'],
      include: ['src/**/*'],
      provider: 'v8',
      reporter: ['text'],
    },
    css: false,
    environment: 'jsdom',
    globals: true,
    maxConcurrency: 8,
    setupFiles: ['./src/test/setupTests.ts'],
  },
});
