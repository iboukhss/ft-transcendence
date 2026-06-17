import { getJobs } from '#server/services/jobs/get-jobs.service.js'

export default defineEventHandler(async (event) => {
  const companyUser = event.context.auth.user // middleware already verified that the API Key belongs to company user

  const jobs = await getJobs({ userId: companyUser.id })

  return jobs
})

defineRouteMeta({
  openAPI: {
    tags: ['v1'],
    description: 'API route used to get all posted jobs',
    security: [{ ApiKeyAuth: [] }]
  }
})
