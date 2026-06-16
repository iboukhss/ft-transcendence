import { deleteAvatar } from '#server/services/profile/delete-avatar.service.js'
import { db, tables } from '#server/utils/db.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  await deleteAvatar(db, tables, session.user.id, session.user.accountType)

  await setUserSession(event, {
    user: {
      ...session.user,
      avatarUrl: null
    }
  })

  return { success: true }
})
