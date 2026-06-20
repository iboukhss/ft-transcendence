import { getJobs } from '#server/services/jobs/get-jobs.service'
import { jobsQuerySchema } from '#shared/dto/job.dto'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, jobsQuerySchema.parse)

  return getJobs(query)
})
