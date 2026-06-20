import { updateUser } from '#server/services/admin/update-user.service'
import { db, tables } from '#server/utils/db'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'
import { getRouterParamAsNumber } from '#server/utils/router'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  requireAdmin(session.user)

  const userId = getRouterParamAsNumber(event)
  const body = await readBody(event)

  return updateUser(db, tables, userId, session.user.id, body)
})
