/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'be.museumlampung.store',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'museumlampung.store',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.37',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'museumlampung.store',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**', // tambahkan pathname default
      }
    ],
    // Ini opsional, hanya boleh yang valid menurut docs:
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp'],
    disableStaticImages: false,
  },
  reactStrictMode: true, // tambahan best practice
};

export default nextConfig;
