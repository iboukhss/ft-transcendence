import { checkApiKey } from '#server/services/auth/check-api-key.service'
import { db, tables } from '#server/utils/db' // Explicit import if not auto-imported
import { throw401, throw403 } from '#server/utils/throwError.js'

const apiCache = useStorage('cache')
const CACHE_TTL = 60 * 1000 // 1 minute cache lifetime

interface CachedAuth {
  userId: number
  accountType: 'company' | 'freelancer' | string
}

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/v1/')) return

  const apiKey = getHeader(event, 'x-api-key')

  if (!apiKey) {
    return throw401('Header is missing API key : x-api-key')
  }

  let authContext: CachedAuth | null = null
  const cacheKey = `api-key:${apiKey}`

  // 1. Check the In-Memory Cache first
  const cachedData = await apiCache.getItem<CachedAuth>(cacheKey)

  if (cachedData) {
    authContext = cachedData
  }
  else {
    const dbResult = await checkApiKey(db, tables, apiKey)

    if (!dbResult) {
      return throw500('API Key could not be validated')
    }

    authContext = {
      userId: dbResult.userId,
      accountType: dbResult.accountType
    }

    // 3. Save to In-Memory Cache with a Time-To-Live (TTL)
    await apiCache.setItem(cacheKey, authContext, { ttl: CACHE_TTL })
  }

  // 4. Attach verified credentials to the event context
  event.context.auth = authContext

  // 5. Enforce strict namespace segregation (Actor isolation)
  if (event.path.startsWith('/api/v1/company/') && event.context.auth.accountType !== 'company') {
    throw403('This endpoint requires a Company API key')
  }

  if (event.path.startsWith('/api/v1/freelancer/') && event.context.auth.accountType !== 'freelancer') {
    throw403('This endpoint requires a Freelancer API key')
  }
})
