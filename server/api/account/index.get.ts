import { getAccount } from '#server/services/account/get-account.service'
import { db, tables } from '#server/utils/db'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const account = await getAccount(db, tables, session.user.id)
  return account
})
