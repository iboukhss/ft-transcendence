import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

export async function deleteAccount(db: DB, tables: Tables, userId: number, password: string) {
  // Fetch the user to verify password
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

  // Verify password before allowing deletion
  const valid = await verifyPassword(user.password, password)

  if (!valid) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
      statusMessage: 'Invalid password'
    })
  }

  // Password verified — proceed with deletion
  const [deletedUser] = await db
    .delete(tables.users)
    .where(eq(tables.users.id, userId))
    .returning()

  return deletedUser
}
