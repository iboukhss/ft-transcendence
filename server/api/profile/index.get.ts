import { getProfileById } from '#server/services/profile/get-profile-by-id.service.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  return await getProfileById(session.user.id)
})
