import { z } from 'zod'

import { categoryEnum, countryEnum, skillsEnum, workPlaceEnum } from '#server/database/schema.js'
import { getJobs, getJobsAmount } from '#server/services/jobs/get-jobs.service.js'

const querySchema = z.object({
  page: z.string().optional(),
  userId: z.coerce.number().optional(),
  search: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
  categories: z.string().optional(),
  workplace: z.string().optional(),
  salaryStart: z.string().optional(),
  salaryEnd: z.string().optional()
})
/*
const { selectedSkills, verifySkillCheckboxes } = useSkillsFilter()
const { selectedLocations, verifyLocationCheckboxes } = useLocationsFilter()
const { selectedCategories, verifyCategoryCheckboxes } = useCategoriesFilter()
const { selectedWorkplaces, verifyWorkplaceCheckboxes } = useWorkplacesFilter()
const { selectedSalary, verifySalarySliders } = useSalaryFilter()
*/

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  const filter_data = {
    skills: query.skills
      ? query.skills
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(
            (s): s is (typeof skillsEnum.enumValues)[number] =>
              skillsEnum.enumValues.includes(
                s as (typeof skillsEnum.enumValues)[number]
              )
          )
      : undefined,
    location: query.location
      ? query.location
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(
            (s): s is (typeof countryEnum.enumValues)[number] =>
              countryEnum.enumValues.includes(
                s as (typeof countryEnum.enumValues)[number]
              )
          )
      : undefined,
    categories: query.categories
      ? query.categories
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(
            (s): s is (typeof categoryEnum.enumValues)[number] =>
              categoryEnum.enumValues.includes(
                s as (typeof categoryEnum.enumValues)[number]
              )
          )
      : undefined,
    workplace: query.workplace
      ? query.workplace
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(
            (s): s is (typeof workPlaceEnum.enumValues)[number] =>
              workPlaceEnum.enumValues.includes(
                s as (typeof workPlaceEnum.enumValues)[number]
              )
          )
      : undefined,
    salaryStart: query.salaryStart ? parseInt(query.salaryStart) : 1,
    salaryEnd: query.salaryEnd ? parseInt(query.salaryEnd) : 500
  }
  if (filter_data.skills && filter_data.skills?.length <= 0)
    filter_data.skills = undefined
  if (filter_data.categories && filter_data.categories?.length <= 0)
    filter_data.categories = undefined
  if (!query.page) {
    const amount = await getJobsAmount(filter_data)
    return { JobsAmount: amount }
  }

  return getJobs(filter_data, { userId: query.userId, page: parseInt(query.page as string) })
})
