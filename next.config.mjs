/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Untuk pengembangan lokal
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      // Untuk produksi - Museum Lampung
      {
        protocol: 'https',
        hostname: 'be.museumlampung.store',
        pathname: '/uploads/**',
      },
      // Domain alternatif tanpa www
      {
        protocol: 'https',
        hostname: 'museumlampung.store',
        pathname: '/uploads/**',
      },
      // Untuk gambar placeholder
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
    // Kualitas gambar 85% (lebih baik dari default 75)
    quality: 85,
    // Ukuran device untuk gambar responsif
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Format gambar yang dioptimalkan
    formats: ['image/webp'],
    // Tetap aktifkan di development
    disableStaticImages: false,
  },
  // Opsi keamanan tambahan
  experimental: {
    images: {
      allowFutureImage: true,
    }
  }
};

export default nextConfig;