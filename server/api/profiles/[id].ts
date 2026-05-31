import { getProfileById } from '#server/services/profile/get-profile-by-id.service'

export default defineEventHandler(async (event) => {
  const targetId = Number(getRouterParam(event, 'id'))

  if (!targetId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID parameter' })
  }

  return getProfileById(targetId)
})
