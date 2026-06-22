import { insertApiKey } from '#server/services/auth/insert-api-key.service'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { apiKeySchema } from '#shared/dto/api-key.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireAdmin(session.user)
  const body = await readBody(event)

  const result = await apiKeySchema.safeParse(body)

  const validData = await validateOrThrow(result)

  return await insertApiKey(
    validData
  )
})
