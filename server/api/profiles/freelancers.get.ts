import { getFreelancerProfiles } from '#server/services/profile/get-freelancers.service.js'

export default defineEventHandler(async (event) => {
  const { page } = getQuery(event)
  console.log(page)
  console.log(typeof page)
  if (!page)
    return ([])
  return getFreelancerProfiles(parseInt(page as string))
})
