import path from 'node:path';

import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
      stylelint: {
        lintCommand: 'stylelint ./src/**/*.{css,scss} --quiet-deprecation-warnings',
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      all: true,
      exclude: [
        'src/test/**/*',
        '**/types.ts',
        '**/types/*',
        '**/*.d.ts',
        '**/index.ts',
        'src/index.tsx',
        'src/App.tsx',
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
