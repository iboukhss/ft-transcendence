import { createJob } from '#server/services/jobs/company/create-job.service.js'
import { db, tables } from '#server/utils/db'
import { requireCompany } from '#server/utils/permission-utils.js'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { jobSchema } from '#shared/dto/job.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireCompany(session.user)

  const body = await readBody(event)

  const result = jobSchema.safeParse(body)

  const validData = await validateOrThrow(result)

  const job = await createJob(db, tables, session.user.id, validData)

  return { job }
})
