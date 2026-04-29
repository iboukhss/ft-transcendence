import { updateJob } from '#server/services/jobs/company/update-job.service.js'
import { requireCompany } from '#server/utils/permission-utils.js'
import { jobSchema } from '#shared/dto/job.dto.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireCompany(session.user)

  const body = await readBody(event)

  const result = jobSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid job format' })
  }

  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    throw createError ({
      statusCode: 400,
      message: 'Invalid jobId'
    })
  }

  const updatedJob = await updateJob(db, tables, session, Number(jobId), result.data)

  return { updatedJob }
})
