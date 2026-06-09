import { getFreelancerProfiles } from '#server/services/profile/get-freelancers.service.js'

export default defineEventHandler(async () => {
  return getFreelancerProfiles()
})
