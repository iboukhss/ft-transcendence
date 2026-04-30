import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { LoginDTO } from '#shared/dto/login.dto.js'

import { toSessionUserDTO } from '#server/dto/user.dto'

export async function loginUser(db: DB, tables: Tables, dto: LoginDTO) {
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

  return toSessionUserDTO(user)
}
