import { eq } from 'drizzle-orm'

import { toUserDTO } from '#server/dto/user.dto'

export async function loginUser(db: any, tables: any, email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.email, email)
  })

  if (!user) {
    throw createError({ statusCode: 401 })
  }

  const valid = await verifyPassword(user.password, password)

  if (!valid) {
    throw createError({ statusCode: 401 })
  }

  return toUserDTO(user)
}
