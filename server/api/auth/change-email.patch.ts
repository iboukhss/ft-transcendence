import { changeEmail } from '#server/services/auth/change-email.service'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { emailSchema } from '#shared/dto/email.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)
  const result = emailSchema.safeParse(body)
  const validData = validateOrThrow(result)

  const serviceResult = await changeEmail(session.user.id, validData)

  await setUserSession(event, {
    user: {
      ...session.user,
      email: validData.email
    }
  })

  return serviceResult
})
