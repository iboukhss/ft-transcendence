import { getJobs } from '#server/services/jobs/company/get-jobs.service.js'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const companyUser = event.context.auth.user // middleware already verified that the API Key belongs to company user

  const jobs = await getJobs(db, tables, companyUser.id)

  return jobs
})
