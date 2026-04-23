import { getProfile } from '#server/services/get-profile.service'
import { requireUserSession } from '#server/utils/auth'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const userId = session.user.id

  const profile = await getProfile(db, tables, userId)

  return {
    profile
  }
})
