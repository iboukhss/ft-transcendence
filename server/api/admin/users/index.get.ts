import { getUsers } from '#server/services/admin/get-users.service'
import { db, tables } from '#server/utils/db'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  requireAdmin(session.user)

  const query = getQuery(event)
  const search = query.search as string | undefined

  return getUsers(db, tables, search)
})
