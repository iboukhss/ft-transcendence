import { count } from 'drizzle-orm'

import type { ProfileDTO } from '#shared/dto/profile.dto.js'

import { profileSchema } from '#shared/dto/profile.dto.js'

export async function getFreelancerProfiles(page: number): Promise<ProfileDTO[]> {
  const data_limit = 10
  const records = await db
    .select()
    .from(tables.freelancerProfiles)
    .offset((page - 1) * data_limit)
    .limit(data_limit)
  return records.map((profileData) => {
    return profileSchema.parse({
      type: 'freelancer',
      ...profileData
    })
  })
}

export async function getFreelancersAmount(): Promise<number> {
  const result = await db
    .select({ amount: count() })
    .from(tables.freelancerProfiles)

  return result[0]!.amount
}
