/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async redirects() {
    return [
      // 301 redirects from old single-page URLs (SEO-3)
      { source: '/#cement', destination: '/cement', permanent: true },
      { source: '/#steel', destination: '/steel-wire', permanent: true },
      { source: '/#roofing', destination: '/roofing', permanent: true },
      { source: '/#tanks', destination: '/water-tanks', permanent: true },
      { source: '/#paints', destination: '/paints', permanent: true },
      { source: '/#gypsum', destination: '/gypsum-ceiling', permanent: true },
      { source: '/#plumbing', destination: '/plumbing-pipes', permanent: true },
      { source: '/#fencing', destination: '/fencing', permanent: true },
    ]
  },
}

module.exports = nextConfig
