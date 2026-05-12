import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { ProfileDTO } from '#shared/dto/profile.dto'

import { toProfileResponseDTO } from '#server/dto/profile.dto'

export async function patchProfile(db: DB, tables: Tables, userId: number, dto: ProfileDTO) {
  const [profile] = await db
    .update(tables.profiles)
    .set({
      ...dto,
      updatedAt: new Date()
    })
    .where (eq(tables.profiles.userId, userId))
    .returning()

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return toProfileResponseDTO(profile)
}
