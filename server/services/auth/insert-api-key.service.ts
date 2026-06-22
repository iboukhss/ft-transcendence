import { eq } from 'drizzle-orm'

import type { ApiKeyDTO } from '#shared/dto/api-key.dto'

import { apiKeysResponseSchema } from '#server/dto/api-key.dto.js'

export async function insertApiKey(dto: ApiKeyDTO) {
  const { userId, ...insertData } = dto

    if (!insertData.key) {
    return throw500('Key is required to insert an API key')
  }

  const payload = {
    userId,
    key: insertData.key,
    updatedAt: new Date()
  } as any

  if (insertData.name !== undefined) payload.name = insertData.name
  if (insertData.is_active !== undefined) payload.isActive = insertData.is_active
  if (insertData.expires_at !== undefined) payload.expiresAt = insertData.expires_at

  const [insertedApiKey] = await db
    .insert(tables.apiKeys)
    .values(payload)
    .returning()

  if (!insertedApiKey) throw500('Api Key could not be inserted')

  return apiKeysResponseSchema.parse(insertedApiKey)
}
