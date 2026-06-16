import { getJobById } from '#server/services/jobs/get-job-by-id.service.js'

export default defineEventHandler(async (event) => {
  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    return throw400('Missing required jobId parameter in request URL')
  }

  const job = await getJobById(parseInt(jobId))

  return job
})

defineRouteMeta({
  openAPI: {
    tags: ['v1'],
    description: 'API route used to retrieve a job by passing the respective job id as parameter',
    security: [{ ApiKeyAuth: [] }]
  }
})
