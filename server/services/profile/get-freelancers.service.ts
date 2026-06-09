import type { ProfileDTO } from '#shared/dto/profile.dto.js'

import { profileSchema } from '#shared/dto/profile.dto.js'

export async function getFreelancerProfiles(): Promise<ProfileDTO[]> {
  const records = await db
    .select()
    .from(tables.freelancerProfiles)

  return records.map((profileData) => {
    return profileSchema.parse({
      type: 'freelancer',
      ...profileData
    })
  })
}
