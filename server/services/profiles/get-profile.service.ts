import { eq } from 'drizzle-orm'
import { toProfileResponseDTO } from '#server/dto/profile-response.dto.js'

export async function getProfile(
  db: any,
  tables: any,
  userId: number
) {
  const profile
    = await db.query.profiles.findFirst({

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
