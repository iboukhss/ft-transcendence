import { changeEmail } from '#server/services/auth/change-email.service'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { emailSchema } from '#shared/dto/email.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  const result = await emailSchema.safeParse(body)

  const validData = await validateOrThrow(result)

  return await changeEmail(
    session.user.id,
    validData
  )
})
