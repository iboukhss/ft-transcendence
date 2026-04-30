import { updateJob } from '#server/services/jobs/company/update-job.service.js'
import { db, tables } from '#server/utils/db'
import { requireCompany } from '#server/utils/permission-utils.js'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { jobSchema } from '#shared/dto/job.dto.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireCompany(session.user)

  const body = await readBody(event)

  const result = jobSchema.safeParse(body)

  const validData = await validateOrThrow(result)

  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    throw createError ({
      statusCode: 400,
      message: 'Invalid jobId'
    })
  }

  const updatedJob = await updateJob(db, tables, session.user.id, Number(jobId), validData)

  return { updatedJob }
})
