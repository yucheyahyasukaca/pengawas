// Alternative next.config.ts for non-standalone mode
// Rename this to next.config.ts if you want to use non-standalone mode

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'standalone' for non-standalone mode
  // output: 'standalone', // Commented out for non-standalone
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

