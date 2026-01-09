import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    // Disable optimization in development so images load directly from Local by Flywheel
    // In production, Next.js will optimize images from the production WordPress domain
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'websiteplayground.local',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'websiteplayground.local',
        pathname: '/wp-content/uploads/**',
      },
      // Production WordPress domain
      {
        protocol: 'https',
        hostname: 'wpstarter.mysites.io',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  // Environment variables that should be available on the client
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
  },
};

export default nextConfig;
