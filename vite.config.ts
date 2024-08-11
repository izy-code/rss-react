import path from 'node:path';

import { vitePlugin as remix } from '@remix-run/dev';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    !process.env.VITEST
      ? remix({
          appDirectory: 'src/app',
          ignoredRouteFiles: ['**/*.scss', '**/*.test.{ts,tsx}'],
          buildDirectory: 'dist',
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
          },
        })
      : react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      all: true,
      exclude: ['src/test/**/*', '**/types.ts', '**/types/*', '**/*.d.ts', '**/index.ts', 'src/**/*/enums.ts'],
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
