// server/services/auth.service.ts
import { eq } from 'drizzle-orm'

export async function registerUser(db: any, tables: any, email: string, password: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(tables.users.email, email)
  })

  if (existingUser) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const hashedPassword = await hashPassword(password)

  const result = await db.insert(tables.users).values({
    email,
    password: hashedPassword
  }).returning()

  const user = result[0]

  if (!user) {
    throw createError({ statusCode: 500, message: 'User creation failed' })
  }

  return user
}
