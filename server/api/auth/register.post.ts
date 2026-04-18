// server/api/auth/register.post.ts
import { registerUser } from '#server/services/register.service'
import { toUserDTO } from '#server/dto/user.dto'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Missing credentials' })
  }

  const user = await registerUser(db, tables, email, password)

  await setUserSession(event, {
    user: toUserDTO(user)
  })

  return {
    user: toUserDTO(user)
  }
})
