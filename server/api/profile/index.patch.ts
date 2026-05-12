import { patchProfile } from '#server/services/profile/patch-profile.service.js'
import { db, tables } from '#server/utils/db'
import { profileSchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)

  const result = profileSchema.safeParse(body)

  const validData = validateOrThrow(result)

  const profile = await patchProfile(db, tables, session.user.id, validData)

  return profile
})
