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

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'supabase2.garuda-21.com',
      },
      // Support for Supabase storage domains (add specific project domains if needed)
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },

  // Ensure API routes and dynamic routes are properly included in standalone build
  // In Next.js 16, outputFileTracingIncludes is at root level, not under experimental
  // This ensures all API routes and dynamic routes are included in the standalone output
  outputFileTracingIncludes: {
    '/api/**/*': ['./app/api/**/*'],
    // Include dynamic routes for sekolah
    '/pengawas/manajemen-data/sekolah/*': ['./app/(pengawas)/pengawas/manajemen-data/sekolah/**/*'],
  },
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    exclude: [
      /version\.json$/, // Critical: ensure version check always hits network
      /_buildManifest\.js$/,
      /_ssgManifest\.js$/
    ],
  }
});

export default withPWA(nextConfig);
