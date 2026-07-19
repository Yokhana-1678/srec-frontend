/** @type {import('next').NextConfig} */
const nextConfig = {
  // Target modern browsers only to eliminate legacy JS polyfills (~8 KiB savings)
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Image optimization – serve WebP/AVIF automatically
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [36, 64, 96, 128, 256],
  },
  // Modern output for smaller bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
