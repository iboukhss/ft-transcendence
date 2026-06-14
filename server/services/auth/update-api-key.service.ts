import { eq } from 'drizzle-orm'

import type { ApiKeyDTO } from '#shared/dto/api-key.dto'

import { apiKeysResponseSchema } from '#server/dto/api-key.dto.js'

export async function updateApiKey(dto: ApiKeyDTO) {
  const { userId, ...updateData } = dto

  const payload: Record<string, any> = {
    updatedAt: new Date()
  }

  if (updateData.key !== undefined) payload.key = updateData.key
  if (updateData.name !== undefined) payload.name = updateData.name
  if (updateData.is_active !== undefined) payload.isActive = updateData.is_active
  if (updateData.expires_at !== undefined) payload.expiresAt = updateData.expires_at

  const [updatedApiKey] = await db
    .update(tables.apiKeys)
    .set(payload)
    .where(eq(tables.apiKeys.userId, dto.userId))
    .returning()

  if (!updatedApiKey) throw500('Api Key could not be updated')

  return apiKeysResponseSchema.parse(updatedApiKey)
}
