import { getUser } from '#server/services/admin/get-user.service'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireAdmin(session.user)

  const userId = getRouterParamAsNumber(event)

  return getUser(db, tables, userId)
})
