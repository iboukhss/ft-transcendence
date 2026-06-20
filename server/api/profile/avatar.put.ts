import { deleteAvatar } from '#server/services/profile/delete-avatar.service.js'
import { putAvatar } from '#server/services/profile/put-avatar.service.js'
import { db, tables } from '#server/utils/db.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const sessionUser = session.user

  const formData = await readMultipartFormData(event)
  if (!formData || !formData.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files uploaded'
    })
  }

  try {
    await deleteAvatar(db, tables, session.user.id, session.user.accountType)
  }
  catch (err) {
    console.warn('[PUT avatar] failed to delete existing avatar:', err)
  }

  const result = await putAvatar(sessionUser, formData)
  await setUserSession(event, {
    user: {
      ...session.user,
      avatarUrl: result.avatarUrl
    }
  })
  return result
})
