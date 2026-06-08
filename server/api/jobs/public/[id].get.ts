import { getJobById } from '#server/services/jobs/public/get-job-by-id.service'
import { getRouterParamAsNumber } from '#server/utils/router'

export default defineEventHandler(async (event) => {
  const jobId = getRouterParamAsNumber(event)

  const job = await getJobById(jobId)

  return job
})
