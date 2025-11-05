import type { NextConfig } from "next";

/**
 * Next.js Configuration - Standalone Mode
 * 
 * Standalone mode provides:
 * - Faster startup time (smaller image size)
 * - Better performance (only includes necessary files)
 * - Optimized for Docker deployment
 */
const nextConfig: NextConfig = {
  // Standalone mode for optimal performance and smaller Docker image
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
  // This ensures all API routes are included in the standalone output
  outputFileTracingIncludes: {
    '/api/**/*': ['./app/api/**/*'],
  },
};

export default nextConfig;
