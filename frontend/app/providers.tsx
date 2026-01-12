'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr';

/**
 * Global providers wrapper for the application
 *
 * Wraps the app with:
 * - SWRConfig: Client-side data caching with stale-while-revalidate pattern
 *
 * This enables instant page loads by serving cached data immediately
 * while revalidating in the background for fresh content.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}
