import { eq } from 'drizzle-orm'

import type { ProfileDTO } from '#shared/dto/profile.dto'

import { db, tables } from '#server/utils/db'
import { profileSchema } from '#shared/dto/profile.dto'

export async function getProfileById(targetId: number): Promise<ProfileDTO> {
  const [user] = await db
    .select({
      id: tables.users.id,
      accountType: tables.users.accountType
    })
    .from(tables.users)
    .where(eq(tables.users.id, targetId))

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const table = user.accountType === 'freelancer' ? tables.freelancerProfiles : tables.companyProfiles

  const [profileData] = await db
    .select()
    .from(table)
    .where(eq(table.userId, user.id))

  if (!profileData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Profile not found'
    })
  }

  return profileSchema.parse({
    type: user.accountType,
    ...profileData
  })
}
