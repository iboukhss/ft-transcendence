import { getAccount } from '#server/services/account/get-account.service'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const account = await getAccount(db, tables, session.user.id)

  return account
})
