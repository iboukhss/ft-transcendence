import type { H3Event } from 'h3'

import { eq } from 'drizzle-orm'

import { db, tables } from '#server/utils/db'

/**
 * Wraps requireUserSession with a check that the session's user still
 * exists in the database. requireUserSession only validates the signed
 * cookie — it does NOT check the user row hasn't been deleted (e.g. by
 * an admin, or via account self-deletion) since the cookie was issued.
 *
 * If the user no longer exists, the stale session is cleared and a 401
 * is thrown, instead of letting the request proceed and crash later
 * with an unhandled foreign-key violation.
 */
export async function requireValidUserSession(event: H3Event) {
  const session = await requireUserSession(event)

  const user = await db
    .select({ id: tables.users.id })
    .from(tables.users)
    .where(eq(tables.users.id, session.user.id))
    .then(rows => rows[0])

  if (!user) {
    await clearUserSession(event)
    throw createError({
      statusCode: 401,
      statusMessage: 'Your session is no longer valid. Please log in again.'
    })
  }

  return session
}
