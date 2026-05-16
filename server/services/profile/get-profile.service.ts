import { eq } from 'drizzle-orm'

import type { DB } from '#server/utils/db'

import { profileSchema, type ProfileDTO } from '#shared/dto/profile.dto.js'

export async function getProfile(db: DB, tables: Tables, userId: number, accountType: string): Promise<ProfileDTO> {
  let rawData

  if (accountType == 'freelancer') {
    rawData = await db.query.freelancerProfiles.findFirst({
      where: eq(tables.freelancerProfiles.userId, userId)
    })
  }
  else {
    rawData = await db.query.companyProfiles.findFirst({
      where: eq(tables.companyProfiles.userId, userId)
    })
  }

  if (!rawData) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  // NOTE(isma): Zod will filter things that are not part of the schema
  return profileSchema.parse({
    type: accountType,
    ...rawData
  })
}
