import { eq } from 'drizzle-orm'

import { deleteUser } from '#server/services/admin/delete-user.service'
import { db, tables } from '#server/utils/db'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'
import { getRouterParamAsNumber } from '#server/utils/router'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  requireAdmin(session.user)

  const userId = getRouterParamAsNumber(event)
  const body = await readBody(event)

  // Guardrail 4 (API level) — admin must provide their own password
  if (!body?.adminPassword) {
    throw createError({
      statusCode: 400,
      message: 'Admin password is required'
    })
  }

  // Fetch admin's own record to verify password
  const admin = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, session.user.id))
    .then(rows => rows[0])

  if (!admin) {
    throw createError({ statusCode: 404, message: 'Admin user not found' })
  }

  const valid = await verifyPassword(admin.password, body.adminPassword)

  if (!valid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid admin password'
    })
  }

  // Guardrail 3 (API level) — admin cannot delete their own account
  if (userId === session.user.id) {
    throw createError({
      statusCode: 403,
      message: 'You cannot delete your own account'
    })
  }

  return deleteUser(db, tables, userId, session.user.id)
})
