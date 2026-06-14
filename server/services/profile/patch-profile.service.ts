import { eq } from 'drizzle-orm'

import type { PatchProfileDTO, ProfileDTO } from '#shared/dto/profile.dto'

import { getProfileById } from '#server/services/profile/get-profile-by-id.service.js'
import { db, tables } from '#server/utils/db'

export async function patchProfile(dto: PatchProfileDTO): Promise<ProfileDTO> {
  if (dto.type === 'freelancer') {
    const { userId, type, ...profileData } = dto

    await db
      .update(tables.freelancerProfiles)
      .set({
        ...profileData,
        updatedAt: new Date()
      })
      .where(eq(tables.freelancerProfiles.userId, dto.userId))
  }
  else {
    const { type, userId, ...profileData } = dto

    await db
      .update(tables.companyProfiles)
      .set({
        ...profileData,
        updatedAt: new Date()
      })
      .where(eq(tables.companyProfiles.userId, dto.userId))
  }

  return getProfileById(dto.userId)
}
