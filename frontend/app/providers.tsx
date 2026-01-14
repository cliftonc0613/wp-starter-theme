'use client';

import { SWRConfig } from 'swr';
import { ThemeProvider } from 'next-themes';
import { swrConfig } from '@/lib/swr';
import { WebVitals } from '@/components/WebVitals';

/**
 * Global providers wrapper for the application
 *
 * Wraps the app with:
 * - ThemeProvider: Dark/light mode support with system preference detection
 * - SWRConfig: Client-side data caching with stale-while-revalidate pattern
 * - WebVitals: Core Web Vitals monitoring and reporting
 *
 * This enables instant page loads by serving cached data immediately
 * while revalidating in the background for fresh content.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SWRConfig value={swrConfig}>
        <WebVitals />
        {children}
      </SWRConfig>
    </ThemeProvider>
  );
}
