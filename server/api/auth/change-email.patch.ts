import { changeEmail } from '#server/services/auth/change-email.service.js'
import { db, tables } from '#server/utils/db'
import { validateOrThrow } from '#server/utils/validateOrThrow.js'
import { emailSchema } from '#shared/dto/email.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  const result = await emailSchema.safeParse(body)

  const validData = await validateOrThrow(result)

  const changedEmail = await changeEmail(db, tables, session.user.id, validData)

  return changedEmail
})
