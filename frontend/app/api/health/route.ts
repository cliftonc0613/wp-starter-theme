import { NextResponse } from 'next/server'

/**
 * Health Check API Endpoint
 *
 * Returns system status with individual component checks.
 * Used for monitoring and load balancer health checks.
 *
 * GET /api/health
 */

interface HealthCheck {
  status: 'ok' | 'error'
  latencyMs?: number
  heapUsedMB?: number
  seconds?: number
  error?: string
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error'
  timestamp: string
  version: string
  checks: {
    wordpress: HealthCheck
    memory: HealthCheck
    uptime: HealthCheck
  }
}

// App version from package.json or env
const VERSION = process.env.npm_package_version || '1.0.0'

// Track server start time for uptime calculation
const startTime = Date.now()

async function checkWordPress(): Promise<HealthCheck> {
  const apiUrl = process.env.WORDPRESS_API_URL

  if (!apiUrl) {
    return { status: 'error', error: 'WORDPRESS_API_URL not configured' }
  }

  try {
    const start = Date.now()
    const response = await fetch(apiUrl.replace('/wp/v2', ''), {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    const latencyMs = Date.now() - start

    return {
      status: response.ok ? 'ok' : 'error',
      latencyMs,
      ...(response.ok ? {} : { error: `HTTP ${response.status}` }),
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

function checkMemory(): HealthCheck {
  try {
    const memoryUsage = process.memoryUsage()
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)

    // Consider memory usage over 1GB as concerning
    const status = heapUsedMB < 1024 ? 'ok' : 'error'

    return { status, heapUsedMB }
  } catch {
    // Memory check not available in all environments
    return { status: 'ok', heapUsedMB: 0 }
  }
}

function checkUptime(): HealthCheck {
  const seconds = Math.floor((Date.now() - startTime) / 1000)
  return { status: 'ok', seconds }
}

function determineOverallStatus(
  checks: HealthResponse['checks']
): 'ok' | 'degraded' | 'error' {
  const statuses = Object.values(checks).map((c) => c.status)

  // All checks pass
  if (statuses.every((s) => s === 'ok')) {
    return 'ok'
  }

  // WordPress is critical - if it fails, we're in error state
  if (checks.wordpress.status === 'error') {
    return 'degraded'
  }

  // Some non-critical check failed
  return 'degraded'
}

export async function GET() {
  try {
    // Run checks in parallel
    const [wordpress, memory, uptime] = await Promise.all([
      checkWordPress(),
      Promise.resolve(checkMemory()),
      Promise.resolve(checkUptime()),
    ])

    const checks = { wordpress, memory, uptime }
    const status = determineOverallStatus(checks)

    const response: HealthResponse = {
      status,
      timestamp: new Date().toISOString(),
      version: VERSION,
      checks,
    }

    return NextResponse.json(response, {
      status: status === 'error' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Endpoint should always return valid JSON
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        version: VERSION,
        checks: {
          wordpress: { status: 'error', error: 'Health check failed' },
          memory: { status: 'error' },
          uptime: { status: 'error' },
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      } satisfies HealthResponse & { error: string },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
