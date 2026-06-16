import { eq } from 'drizzle-orm'

import type { PasswordDTO } from '#shared/dto/password.dto'

import { db, tables } from '#server/utils/db'

export async function changePassword(userId: number, dto: PasswordDTO) {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, userId)
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User account not found' })
  }

  const valid = await verifyPassword(user.password, dto.oldPassword)

  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid current password' })
  }

  const newPasswordHash = await hashPassword(dto.newPassword)

  const changedPassword = await db
    .update(tables.users)
    .set({
      password: newPasswordHash,
      updatedAt: new Date()
    })
    .where(eq(tables.users.id, userId))

  if (!changedPassword) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update user credentials' })
  }

  return {
    success: true,
    message: 'Password updated successfully'
  }
}
