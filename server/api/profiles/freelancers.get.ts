import { getFreelancerProfiles } from '#server/services/profile/get-freelancers.service'
import { freelancersQuerySchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, freelancersQuerySchema.parse)

  return getFreelancerProfiles(query)
})
