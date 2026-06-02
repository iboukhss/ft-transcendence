import { checkApiKey } from '#server/services/auth/check-api-key.service'
import { db, tables } from '#server/utils/db'
import { throw401, throw403 } from '#server/utils/throwError.js'

const apiCache = useStorage('cache')
const CACHE_TTL = 60 * 1000 // 1 minute cache lifetime

interface CachedAuth {
  userId: number
  accountType: 'company' | 'freelancer'
  role: 'admin' | 'user'
}

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/v1/')) return

  const apiKey = getHeader(event, 'x-api-key')
  if (!apiKey) {
    return throw401('Header is missing API key : x-api-key')
  }

  let cacheData: CachedAuth | null = null
  const cacheKey = `api-key:${apiKey}`

  const cachedData = await apiCache.getItem<CachedAuth>(cacheKey)

  if (cachedData) {
    cacheData = cachedData
  }
  else {
    const dbResult = await checkApiKey(db, tables, apiKey)

    if (!dbResult) {
      return throw500('API Key could not be validated')
    }
    cacheData = {
      userId: dbResult.userId,
      accountType: dbResult.accountType,
      role: dbResult.role
    }

    await apiCache.setItem(cacheKey, cacheData, { ttl: CACHE_TTL })
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

  if (event.path.startsWith('/api/v1/company/') && currentAccountType !== 'company') {
    return throw403('This endpoint requires a Company API key')
  }

  if (event.path.startsWith('/api/v1/freelancer/') && currentAccountType !== 'freelancer') {
    return throw403('This endpoint requires a Freelancer API key')
  }
})
