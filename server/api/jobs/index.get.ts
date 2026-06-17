import { z } from 'zod'

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
      ? query.skills.split(',').map(s => s.toLowerCase())
      : undefined,
    location: query.location,
    categories: query.categories?.split(','),
    workplace: query.workplace,
    salaryStart: query.salaryStart ? parseInt(query.salaryStart) : 1,
    salaryEnd: query.salaryEnd ? parseInt(query.salaryEnd) : 500
  }
  console.log(`debuuuuuuuuggggggggggg: ${filter_data.skills}`)
  if (!query.page) {
    const amount = await getJobsAmount(filter_data)
    return (JSON.stringify({ JobsAmount: amount }))
  }

  console.log(query)
  return getJobs(filter_data, { userId: query.userId, page: parseInt(query.page as string) })
})
