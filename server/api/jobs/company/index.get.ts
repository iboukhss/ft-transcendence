import { getJobs } from '#server/services/jobs/company/get-jobs.service.js'
import { db, tables } from '#server/utils/db'
import { requireCompany } from '#server/utils/permission-utils.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireCompany(session.user)

  const jobs = await getJobs(db, tables, session.user.id)

  return { jobs }
})
