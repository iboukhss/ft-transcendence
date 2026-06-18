import { count, and, arrayContains, inArray } from 'drizzle-orm'

import type { ProfileDTO } from '#shared/dto/profile.dto.js'

import { profileSchema } from '#shared/dto/profile.dto.js'

type filter = {
  location?: string[]
  skills?: string[]
}
export async function getFreelancerProfiles(page: number, filter_data: filter): Promise<ProfileDTO[]> {
  const data_limit = 10
  const records = await db
    .select()
    .from(tables.freelancerProfiles)
    .where(
      and(
        filter_data.location ? inArray(tables.freelancerProfiles.country, filter_data.location) : undefined,
        filter_data.skills ? arrayContains(tables.freelancerProfiles.skills, filter_data.skills) : undefined
      )
    )
    .offset((page - 1) * data_limit)
    .limit(data_limit)
  return records.map((profileData) => {
    return profileSchema.parse({
      type: 'freelancer',
      ...profileData
    })
  })
}

export async function getFreelancersAmount(filter_data: filter): Promise<number> {
  const result = await db
    .select({ amount: count() })
    .from(tables.freelancerProfiles)
    .where(
      and(
        filter_data.location ? inArray(tables.freelancerProfiles.country, filter_data.location) : undefined,
        filter_data.skills ? arrayContains(tables.freelancerProfiles.skills, filter_data.skills) : undefined
      )
    )
  return result[0]!.amount
}
