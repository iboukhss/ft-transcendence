import { eq } from 'drizzle-orm'

import type { DBProfile } from '#server/utils/db'
import type { ProfileDTO } from '#shared/dto/profile.dto'

import { db, tables } from '#server/utils/db'
import { profileSchema } from '#shared/dto/profile.dto'

export async function getProfileById(targetId: number): Promise<ProfileDTO> {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, targetId)
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  let profileData: DBProfile | undefined

  if (user.accountType === 'freelancer') {
    profileData = await db.query.freelancerProfiles.findFirst({
      where: eq(tables.freelancerProfiles.userId, user.id)
    })

    if (!profileData) {
      throw createError({ statusCode: 404, statusMessage: 'Freelancer profile not found' })
    }
  }
  else {
    profileData = await db.query.companyProfiles.findFirst({
      where: eq(tables.companyProfiles.userId, user.id)
    })

    if (!profileData) {
      throw createError({ statusCode: 404, statusMessage: 'Company profile not found' })
    }
  }

  return profileSchema.parse({
    type: user.accountType,
    ...profileData
  })
}
