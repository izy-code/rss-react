/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const nextConfig = {
  reactStrictMode: true,
  distDir: './dist',
  images: {
    remotePatterns: [
      {
        hostname: 'rickandmortyapi.com',
        protocol: 'https',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(dirname, 'styles')],
  },
};

export default nextConfig;
