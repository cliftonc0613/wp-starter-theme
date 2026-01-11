/**
 * Next.js Instrumentation
 *
 * This file runs when the Next.js server starts.
 * Used to configure Node.js DNS resolution to prefer IPv4.
 *
 * This fixes the "fetch failed" error when connecting to Local by Flywheel
 * sites that use .local domains. Node.js defaults to IPv6 (::1) but
 * Local by Flywheel only listens on IPv4 (127.0.0.1).
 */

export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('dns');
    // Force IPv4 first for DNS resolution
    // This fixes Local by Flywheel .local domain resolution
    dns.setDefaultResultOrder('ipv4first');
  }
}
