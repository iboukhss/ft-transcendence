import { hash } from 'bcrypt-ts'

export default defineEventHandler(async (event) => {
  const { username, email, password } = await readBody(event)

  if (!(username && email && password)) {
    throw createError({ statusCode: 400, message: 'Username, email and password must be provided in data body.' })
  }

  const hashedPassword = await hash(password, 10)

  const insertResult = await db.insert(tables.users).values({
    username: username,
    email: email,
    password: hashedPassword
  })

  return { success: true }
})
