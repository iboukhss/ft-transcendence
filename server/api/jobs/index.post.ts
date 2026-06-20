import { createJob } from '#server/services/jobs/create-job.service.js'
import { requireCompany } from '#server/utils/permission-utils.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { createJobSchema } from '#shared/dto/job.dto'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  requireCompany(session.user)

  const body = await readBody(event)
  const result = createJobSchema.safeParse(body)
  const validData = validateOrThrow(result)

  return createJob(session.user.id, validData)
})
