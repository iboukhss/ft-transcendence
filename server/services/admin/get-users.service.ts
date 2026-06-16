import { ilike, or, eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

export async function getUsers(db: DB, tables: Tables, search?: string) {
  const users = await db
    .select({
      id: tables.users.id,
      email: tables.users.email,
      accountType: tables.users.accountType,
      role: tables.users.role,
      createdAt: tables.users.createdAt,
      updatedAt: tables.users.updatedAt
    })
    .from(tables.users)
    .where(
      search
        ? or(
            ilike(tables.users.email, `%${search}%`)
          )
        : undefined
    )
    .orderBy(tables.users.createdAt)

  return users
}
