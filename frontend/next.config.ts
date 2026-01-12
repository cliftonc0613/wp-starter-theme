import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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

// Wrap with Sentry configuration
// Sentry configuration options: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const sentryConfig = withSentryConfig(withBundleAnalyzer(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/nextjs#options

  // Only upload source maps if auth token is provided
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppresses source map upload logs during build
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Source maps configuration
  sourcemaps: {
    // Delete source maps after upload (don't expose to client)
    deleteSourcemapsAfterUpload: true,
  },

  // Disable tunneling (use direct Sentry connection)
  tunnelRoute: undefined,
});

export default sentryConfig;
