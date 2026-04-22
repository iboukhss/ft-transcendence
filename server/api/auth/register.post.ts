// server/api/auth/register.post.ts
import { registerUser } from '#server/services/register.service'
import { toUserDTO } from '#server/dto/user.dto'
import { RegisterSchema } from '#shared/dto/register.dto'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = RegisterSchema.safeParse(body)

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
