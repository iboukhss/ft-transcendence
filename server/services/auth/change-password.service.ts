import { eq } from 'drizzle-orm'

import type { UserSession } from '#auth-utils'
import type { DB, Tables } from '#server/utils/db'
import type { passwordDTO } from '#shared/dto/password.dto'

import { toPasswordDTO } from '#server/dto/password.dto.js'

export async function changePassword(db: DB, tables: Tables, session: UserSession, dto: passwordDTO) {
  if (!session.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
      statusMessage: 'User not logged in'
    })
  }

  const userId = session.user.id

  // check that oldPassword hash matches db
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, userId)
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Not found',
      statusMessage: 'User not found'
    })
  }

  const valid = await verifyPassword(user.password, dto.oldPassword)

  if (!valid) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
      statusMessage: 'Invalid current password'
    })
  }

  const newPasswordHash = await hashPassword(dto.newPassword)

  const [changedPassword] = await db
    .update(tables.users)
    .set({
      password: newPasswordHash,
      updatedAt: new Date()
    })
    .where(eq(tables.users.id, userId))
    .returning()

  if (!changedPassword) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      statusMessage: 'Update failed'
    })
  }
  return toPasswordDTO(changedPassword)
}
