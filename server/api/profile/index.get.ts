import { getProfile } from '#server/services/profile/get-profile.service.js'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  return await getProfile(
    db,
    tables,
    session.user.id,
    session.user.accountType
  )
})
