import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { LoginDTO } from '#shared/dto/login.dto.js'

import { sessionUserSchema, type SessionUserDTO } from '#shared/dto/user.dto.js'

export async function loginUser(db: DB, tables: Tables, dto: LoginDTO): Promise<SessionUserDTO> {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.email, dto.email)
  })

  if (!user) {
    throw createError({ statusCode: 401 })
  }

  const valid = await verifyPassword(user.password, dto.password)

  if (!valid) {
    throw createError({ statusCode: 401 })
  }

  return sessionUserSchema.parse(user)
}
