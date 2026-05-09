import { updateProfile } from '#server/services/profiles/update-profile.service'
import { db, tables } from '#server/utils/db'
import { profileSchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  const result = profileSchema.safeParse(body)

  const validData = validateOrThrow(result)

  const profile = await updateProfile(db, tables, session.user.id, validData)

  return {
    profile
  }
})
