import { loginUser } from '#server/services/auth/login.service.js'
import { db, tables } from '#server/utils/db'
import { loginSchema } from '#shared/dto/login.dto'

// Read this:
// https://nuxt.com/docs/4.x/directory-structure/server#body-handling
// https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = loginSchema.safeParse(body)

  const validData = validateOrThrow(result)

  const user = await loginUser(db, tables, validData)

  await setUserSession(event, {
    user: user,
    loggedInAt: new Date()
  })

  return { user }
})
