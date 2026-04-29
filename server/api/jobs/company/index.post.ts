import { createJob } from '#server/services/jobs/company/create-job.service.js'
import { db, tables } from '#server/utils/db'
import { requireCompany } from '#server/utils/permission-utils.js'
import { jobSchema } from '#shared/dto/job.dto'

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

  const job = await createJob(db, tables, session, result.data)

  return { job }
})
