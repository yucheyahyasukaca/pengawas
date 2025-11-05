import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Ensure API routes are properly included in standalone build
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./app/api/**/*'],
    },
  },
};

export default nextConfig;
