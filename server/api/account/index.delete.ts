import { deleteAccount } from '#server/services/account/delete-account.service'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  if (!body?.password) {
    throw createError({
      statusCode: 400,
      message: 'Bad request',
      statusMessage: 'Password is required'
    })
  }

  await deleteAccount(db, tables, session.user.id, body.password)
  await clearUserSession(event)
  return { success: true }
})
