import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { ProfileDTO, PatchProfileDTO } from '#shared/dto/profile.dto'

import { profileSchema } from '#shared/dto/profile.dto'

export async function patchProfile(db: DB, tables: Tables, userId: number, dto: PatchProfileDTO): Promise<ProfileDTO> {
  const table = dto.type === 'freelancer'
    ? tables.freelancerProfiles
    : tables.companyProfiles

  const { type, ...dbFields } = dto

  const [profile] = await db
    .update(table)
    .set({
      ...dbFields,
      updatedAt: new Date()
    })
    .where(eq(table.userId, userId))
    .returning()

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return profileSchema.parse({
    type: dto.type,
    ...profile
  })
}
