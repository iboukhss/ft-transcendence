import { updateApiKey } from '#server/services/auth/update-api-key.service'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { apiKeySchema } from '#shared/dto/api-key.dto'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  requireAdmin(session.user)

  const body = await readBody(event)
  const result = await apiKeySchema.safeParse(body)
  const validData = await validateOrThrow(result)

  return await updateApiKey(
    validData
  )
})
