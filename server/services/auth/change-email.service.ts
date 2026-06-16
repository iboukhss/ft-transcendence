import { eq } from 'drizzle-orm'

import type { EmailDTO } from '#shared/dto/email.dto'

export async function changeEmail(userId: number, dto: EmailDTO) {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, userId)
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User account not found' })
  }

  const emailExists = await db.query.users.findFirst({
    where: eq(tables.users.email, dto.email)
  })

  if (emailExists && emailExists.id !== userId) {
    throw createError({ statusCode: 409, statusMessage: 'Email address already in use' })
  }

  const changedEmail = await db
    .update(tables.users)
    .set({
      email: dto.email,
      updatedAt: new Date()
    })
    .where(eq(tables.users.id, userId))

  if (!changedEmail) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update user email' })
  }

  return {
    success: true,
    message: 'Email updated successfully'
  }
}
