import { toUserDTO } from '#server/dto/user.dto'
// server/api/auth/register.post.ts
import { registerUser } from '#server/services/auth/register.service.js'
import { db, tables } from '#server/utils/db'
import { registerSchema } from '#shared/dto/register.dto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = registerSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid register format' })
  }

  const user = await registerUser(db, tables, result.data)

  await setUserSession(event, {
    user
  })

  return {
    user
  }
})
