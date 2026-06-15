import { changePassword } from '#server/services/auth/change-password.service.js'
import { validateOrThrow } from '#server/utils/validateOrThrow.js'
import { passwordSchema } from '#shared/dto/password.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)
  const result = passwordSchema.safeParse(body)
  const validData = validateOrThrow(result)

  return changePassword(session.user.id, validData)
})
