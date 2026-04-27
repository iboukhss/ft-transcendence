import { getProfile } from '#server/services/get-profile.service'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const profile = await getProfile(db, tables, session.user.id)

  return { profile }
})
