import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toProfileResponseDTO } from '#server/dto/profile.dto.js'

export async function getProfile(db: DB, tables: Tables, userId: number) {
  const profile = await db.query.profiles.findFirst(
    {
      where:
        eq(
          tables.profiles.userId,
          userId
        )
    })

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return toProfileResponseDTO(profile)
}
