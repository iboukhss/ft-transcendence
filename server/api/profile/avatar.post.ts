import { uploadAvatar } from '#server/services/profile/upload-avatar.service.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const sessionUser = session.user

  const formData = await readMultipartFormData(event)
  if (!formData || !formData.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files uploaded'
    })
  }

  const result = await uploadAvatar(sessionUser, formData)

  await setUserSession(event, {
    user: {
      ...session.user,
      avatarUrl: result.avatarUrl
    }
  })

  return result
})
