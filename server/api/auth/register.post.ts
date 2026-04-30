import { registerUser } from '#server/services/auth/register.service.js'
import { db, tables } from '#server/utils/db'
import { registerSchema } from '#shared/dto/register.dto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = registerSchema.safeParse(body)

  const validData = validateOrThrow(result)

  const user = await registerUser(db, tables, validData)

  await setUserSession(event, {
    user
  })

  return {
    user
  }
})
