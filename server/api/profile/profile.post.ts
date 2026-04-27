import { updateProfile } from '#server/services/update-profile.service'
import { db, tables } from '#server/utils/db'
import { profileSchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  const result = profileSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid profile format'
    })
  }

  const userId = session.user.id

  const profile = await updateProfile(db, tables, userId, result.data)

  return {
    profile
  }
})
