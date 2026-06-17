import { getFreelancerProfiles, getFreelancersAmount } from '#server/services/profile/get-freelancers.service.js'

export default defineEventHandler(async (event) => {
  const { page } = getQuery(event)

  if (!page) {
    const amount = await getFreelancersAmount()
    return (JSON.stringify({ FreelancersAmount: amount }))
  }
  return getFreelancerProfiles(parseInt(page as string))
})
