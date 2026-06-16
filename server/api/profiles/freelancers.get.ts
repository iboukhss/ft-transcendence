import { getFreelancerProfiles, getFreelancerAccountSize } from '#server/services/profile/get-freelancers.service.js'

export default defineEventHandler(async (event) => {
  const { page } = getQuery(event)
  if (!page) {
    const amount = await getFreelancerAccountSize()
    return (JSON.stringify({ freelancerAmount: amount }))
  }
  return getFreelancerProfiles(parseInt(page as string))
})
