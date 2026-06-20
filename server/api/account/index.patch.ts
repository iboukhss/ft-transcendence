import { patchAccount } from '#server/services/account/patch-account.service'
import { db, tables } from '#server/utils/db'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { accountSchema } from '#shared/dto/account.dto'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const body = await readBody(event)
  const result = accountSchema.safeParse(body)
  const validData = await validateOrThrow(result)
  const account = await patchAccount(db, tables, session.user.id, validData)
  return account
})
