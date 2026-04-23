import { db, tables } from '#server/utils/db'

import { loginUser } from '#server/services/login.service'
import { loginSchema } from '#shared/dto/login.dto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = loginSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid credentials format'
    })
  }

  const { email, password } = result.data

  const user = await loginUser(db, tables, email, password)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }

  return user
})
