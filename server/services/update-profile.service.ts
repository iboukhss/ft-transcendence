import { eq } from 'drizzle-orm'
import type { ProfileDTO } from '#shared/dto/profile.dto'

export async function updateProfile(db: any, tables: any, userId: number, dto: ProfileDTO) {
  const updates = {
    ...(dto.firstName !== undefined && {     //...(condition && { key: value })
      firstName: dto.firstName               //add field to the object "updates"
    }),

    ...(dto.lastName !== undefined && {
      lastName: dto.lastName
    }),

    ...(dto.country !== undefined && {
      country: dto.country
    }),

    ...(dto.houseNumber !== undefined && {
      houseNumber: dto.houseNumber
    }),

    ...(dto.street !== undefined && {
      street: dto.street
    }),

    ...(dto.zip !== undefined && {
      zip: dto.zip
    }),

    ...(dto.language !== undefined && {
      language: dto.language
    }),

    updatedAt: new Date()
  }

  const [profile] = await db
    .update(tables.profiles)
    .set(updates)
    .where (eq(tables.profiles.userId, userId))
    .returning()

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return profile
}
