import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Allow all static image formats including uppercase extensions from camera
    dangerouslyAllowSVG: false,
  },
}

export default nextConfig
