import { loginUser } from '#server/services/login.service'
import { db, tables } from '#server/utils/db'
import { loginSchema } from '#shared/dto/login.dto'

// Read this:
// https://nuxt.com/docs/4.x/directory-structure/server#body-handling
// https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse)

  const user = await loginUser(db, tables, email, password)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }

  await setUserSession(event, {
    user: user,
    loggedInAt: new Date()
  })

  return { user }
})
