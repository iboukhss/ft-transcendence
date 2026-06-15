import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

export async function getAccount(db: DB, tables: Tables, userId: number) {
  const user = await db
    .select({
      email: tables.users.email
    })
    .from(tables.users)
    .where(eq(tables.users.id, userId))
    .then(rows => rows[0])

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return {
    email: user.email,
    houseNumber: null,
    street: null,
    zip: null
  }
}
