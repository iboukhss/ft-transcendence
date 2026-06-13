import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

export async function deleteUser(
  db: DB,
  tables: Tables,
  userId: number,
  adminId: number
) {
  // Guardrail 3 (backend) — admin cannot delete their own account
  if (userId === adminId) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
      statusMessage: 'You cannot delete your own account'
    })
  }

  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, userId))
    .then(rows => rows[0])

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const [deletedUser] = await db
    .delete(tables.users)
    .where(eq(tables.users.id, userId))
    .returning()

  return deletedUser
}
