import { deleteJob } from '#server/services/jobs/company/delete-job.service.js'
import { db, tables } from '#server/utils/db'
import { requireCompany } from '#server/utils/permission-utils.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireCompany(session.user)

  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    throw createError ({
      statusCode: 400,
      message: 'Invalid jobId'
    })
  }

  const deletedJob = await deleteJob(db, tables, session.user.id, Number(jobId))

  return { deletedJob }
})
