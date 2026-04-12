import { compare } from 'bcrypt-ts'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!(email && password)) {
    throw createError({ statusCode: 400, message: 'Email and password must be provided in data body.' })
  }

  const [user] = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)

  if (!user) {
    throw ({ errorCode: 404, message: 'User not found.' })
  }

  if (!(await compare(password, user.password))) {
    throw ({ errorCode: 401, message: 'Password invalid. Unauthorized access.' })
  }

  return { success: true }
})
