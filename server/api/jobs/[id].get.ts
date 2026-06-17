import { getJobById } from '#server/services/jobs/get-job-by-id.service.js'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({ statusCode: 400, statusMessage: 'Job ID is required' })
  }

  const jobId = parseInt(idParam, 10)

  if (isNaN(jobId) || jobId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Job ID format' })
  }

  return getJobById(jobId)
})
