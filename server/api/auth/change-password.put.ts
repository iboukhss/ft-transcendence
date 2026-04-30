import { changePassword } from '#server/services/auth/change-password.service.js'
import { db, tables } from '#server/utils/db'
import { validateOrThrow } from '#server/utils/validateOrThrow.js'
import { passwordSchema } from '#shared/dto/password.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  const result = await passwordSchema.safeParse(body)

  const validData = await validateOrThrow(result)

  const changedPassword = await changePassword(db, tables, session, validData)

  return changedPassword
})
