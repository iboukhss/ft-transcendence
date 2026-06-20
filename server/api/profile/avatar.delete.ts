import { deleteAvatar } from '#server/services/profile/delete-avatar.service.js'
import { db, tables } from '#server/utils/db.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  await deleteAvatar(db, tables, session.user.id, session.user.accountType)
  await replaceUserSession(event, {
    ...session,
    user: {
      ...session.user,
      avatarUrl: null
    }
  })
  return { success: true }
})
