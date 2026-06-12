// server/services/auth/check-api-key.service.ts
import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { throw401 } from '#server/utils/throwError.js'

export async function checkApiKey(db: DB, tables: Tables, apiKey: string) {
  const [dbResult] = await db
    .select({
      userId: tables.apiKeys.userId,
      accountType: tables.users.accountType,
      role: tables.users.role,
      isActive: tables.apiKeys.isActive
    })
    .from(tables.apiKeys)
    .innerJoin(tables.users, eq(tables.apiKeys.userId, tables.users.id))
    .where(eq(tables.apiKeys.key, apiKey))
    .limit(1)

  if (!dbResult || !dbResult.isActive) {
    throw401('Invalid or revoked API key')
  }

  return dbResult
}
