/** @type {import('next').NextConfig} */

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
};

export default nextConfig;
