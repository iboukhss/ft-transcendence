import { checkApiKey } from '#server/services/auth/check-api-key.service'
import { db, tables } from '#server/utils/db'
import { throw401, throw403, throw429, throw500 } from '#server/utils/throwError.js'

const apiCache = useStorage('cache')
const CACHE_TTL = 60 * 1000 // 1 minute cache lifetime

const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5

interface CachedAuth {
  userId: number
  accountType: 'company' | 'freelancer'
  role: 'admin' | 'user'
}

interface RateLimitTracker {
  count: number
  resetTime: number
}

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/v1/')) return

  const apiKey = getHeader(event, 'x-api-key')
  if (!apiKey) {
    return throw401('Missing header [x-api-key] or missing api key')
  }

  let cacheData: CachedAuth | null = null
  const cacheKey = `api-key:${apiKey}`

  // checking if the api key exists already in the cache
  const cachedData = await apiCache.getItem<CachedAuth>(cacheKey)

  if (cachedData) {
    cacheData = cachedData
    // console.log('API Key found in cache')
  }
  else {
    // console.log('API Key to be looked up in DB')
    const dbResult = await checkApiKey(db, tables, apiKey)

    if (!dbResult) {
      return throw500('API Key could not be validated')
    }
    // console.log('API valid !')
    cacheData = {
      userId: dbResult.userId,
      accountType: dbResult.accountType,
      role: dbResult.role
    }

    await apiCache.setItem(cacheKey, cacheData, { ttl: CACHE_TTL })
  }

  const rateLimitKey = `rate-limit:${apiKey}`
  const now = Date.now()

  let tracker = await apiCache.getItem<RateLimitTracker>(rateLimitKey)

  // If no record exists OR the 1-minute window has expired, establish a fresh block window
  if (!tracker || now > tracker.resetTime) {
    // console.log('Initializing new rate limit time window for token...')
    tracker = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    }
  }

  // Increment the tracked interaction counter
  tracker.count++
  await apiCache.setItem(rateLimitKey, tracker)

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - tracker.count)
  const resetSeconds = Math.ceil((tracker.resetTime - now) / 1000)

  // console.log(`Rate Limit Status: ${tracker.count}/${MAX_REQUESTS_PER_WINDOW} (Remaining: ${remaining} | Resets in: ${resetSeconds}s)`)

  // Expose compliant standard headers out to the client
  setHeaders(event, {
    'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetSeconds.toString()
  })

  // Block execution if the threshold is surpassed
  if (tracker.count > MAX_REQUESTS_PER_WINDOW) {
    // console.log(`[RATE LIMIT BREACHED] Key ${apiKey.slice(-4)} rejected for spamming.`)
    setHeader(event, 'Retry-After', resetSeconds)
    return throw429(`Rate limit exceeded. Try again in ${resetSeconds} seconds.`)
  }

  // 4. Attach verified credentials matching your application design architecture
  event.context.auth = {
    user: {
      id: cacheData.userId,
      accountType: cacheData.accountType,
      role: cacheData.role
    },
    isApiKey: true
  }

  // 5. Enforce strict namespace segregation using the newly assigned shape
  const currentAccountType = event.context.auth.user.accountType

  if (event.path.startsWith('/api/v1/jobs/company/') && currentAccountType !== 'company') {
    return throw403('This endpoint requires a Company API key')
  }

  if (event.path.startsWith('/api/v1/jobs/freelancer/') && currentAccountType !== 'freelancer') {
    return throw403('This endpoint requires a Freelancer API key')
  }
})
