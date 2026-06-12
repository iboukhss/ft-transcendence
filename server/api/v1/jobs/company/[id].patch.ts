import { updateJob } from '#server/services/jobs/company/update-job.service.js'
import { db, tables } from '#server/utils/db'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { jobSchema } from '#shared/dto/job.dto.js'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth.user.id

  const body = await readBody(event)

  const result = jobSchema.safeParse(body)

  const validData = await validateOrThrow(result)

  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    return throw400('Missing required jobId parameter in request URL')
  }

  const updatedJob = await updateJob(db, tables, userId, parseInt(jobId), validData)

  return updatedJob
})
