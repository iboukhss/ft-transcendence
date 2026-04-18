import { db, tables } from '#server/utils/db'

import { loginUser } from '#server/services/login.service'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Missing credentials' })
  }

  const user = await loginUser(db, tables, email, password)

  return { user }
})
