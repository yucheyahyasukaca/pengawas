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
  // In Next.js 16, outputFileTracingIncludes is at root level, not under experimental
  outputFileTracingIncludes: {
    '/api/**/*': ['./app/api/**/*'],
  },
};

export default nextConfig;
