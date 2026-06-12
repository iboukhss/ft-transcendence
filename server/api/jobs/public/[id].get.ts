import { getJobById } from '#server/services/jobs/public/get-job-by-id.service.js'

export default defineEventHandler(async (event) => {
  const jobId = Number(getRouterParam(event, 'id'))

  return getJobById(jobId)
})
