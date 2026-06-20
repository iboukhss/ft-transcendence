import { getProfileById } from '#server/services/profile/get-profile-by-id.service.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  return await getProfileById(session.user.id)
})
