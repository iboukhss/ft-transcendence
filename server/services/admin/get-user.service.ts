import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

export async function getUser(db: DB, tables: Tables, userId: number) {
  const user = await db
    .select({
      id: tables.users.id,
      email: tables.users.email,
      accountType: tables.users.accountType,
      role: tables.users.role,
      createdAt: tables.users.createdAt,
      updatedAt: tables.users.updatedAt
    })
    .from(tables.users)
    .where(eq(tables.users.id, userId))
    .then(rows => rows[0])

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  // Fetch profile based on account type
  let profile = null

  if (user.accountType === 'freelancer') {
    profile = await db
      .select()
      .from(tables.freelancerProfiles)
      .where(eq(tables.freelancerProfiles.userId, userId))
      .then(rows => rows[0] ?? null)
  }
  else if (user.accountType === 'company') {
    profile = await db
      .select()
      .from(tables.companyProfiles)
      .where(eq(tables.companyProfiles.userId, userId))
      .then(rows => rows[0] ?? null)
  }

  return { ...user, profile }
}
