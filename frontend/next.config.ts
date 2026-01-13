import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import withPWAInit from "@ducanh2912/next-pwa";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-fonts",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-images",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.(?:wpstarter\.mysites\.io|websiteplayground\.local)\/wp-json\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "wordpress-api",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60,
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /^https:\/\/.*\/wp-content\/uploads\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "wordpress-uploads",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

// Check if we're using a local WordPress (resolves to loopback IP)
// Next.js 14+ blocks image optimization for private IPs (SSRF protection)
const isLocalWordPress = process.env.WORDPRESS_API_URL?.includes('.local') ?? false;

const nextConfig: NextConfig = {
  images: {
    // Disable optimization when:
    // 1. In development mode (images load directly from Local by Flywheel)
    // 2. Using local WordPress (.local domain resolves to private IP, blocked by Next.js)
    // In production with public WordPress domain, images will be optimized
    // Note: Next.js 14+ blocks image optimization for private IPs (SSRF protection)
    unoptimized: true, // Force unoptimized for local WordPress development
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
const sentryConfig = withSentryConfig(withBundleAnalyzer(withPWA(nextConfig)), {
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
