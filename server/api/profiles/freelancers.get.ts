import { skillsEnum, countryEnum } from '#server/database/schema.js'
import { getFreelancerProfiles, getFreelancersAmount } from '#server/services/profile/get-freelancers.service.js'

export default defineEventHandler(async (event) => {
  const { page, location, skills } = getQuery(event)

  const filter_data = {
    location: typeof location === 'string'
      ? location
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(
            (s): s is (typeof countryEnum.enumValues)[number] =>
              countryEnum.enumValues.includes(
                s as (typeof countryEnum.enumValues)[number]
              )
          )
      : undefined,
    skills: typeof skills === 'string'
      ? skills
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(
            (s): s is (typeof skillsEnum.enumValues)[number] =>
              skillsEnum.enumValues.includes(
                s as (typeof skillsEnum.enumValues)[number]
              )
          )
      : undefined
  }

  if (filter_data.skills && filter_data.skills?.length <= 0)
    filter_data.skills = undefined

  if (filter_data.location && filter_data.location?.length <= 0)
    filter_data.location = undefined
  if (!page) {
    const amount = await getFreelancersAmount(filter_data)
    return { FreelancersAmount: amount }
  }
  return getFreelancerProfiles(parseInt(page as string), filter_data)
})
