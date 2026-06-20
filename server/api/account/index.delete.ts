import { deleteAccount } from '#server/services/account/delete-account.service'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const body = await readBody(event)

  if (!body?.password) {
    throw createError({
      statusCode: 400,
      message: 'Bad request',
      statusMessage: 'Password is required'
    })
  }

  await deleteAccount(session.user.id, body.password)
  await clearUserSession(event)
  return { success: true }
})
