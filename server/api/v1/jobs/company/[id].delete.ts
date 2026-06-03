import { deleteJob } from '#server/services/jobs/company/delete-job.service.js'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth.user.id

  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    return throw400('Missing required jobId parameter in request URL')
  }

  const deletedJob = await deleteJob(db, tables, userId, parseInt(jobId))

  return deletedJob
})
