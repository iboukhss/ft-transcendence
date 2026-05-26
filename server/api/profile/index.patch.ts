import { patchProfile } from '#server/services/profile/patch-profile.service.js'
import { db, tables } from '#server/utils/db'
import { patchProfileSchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  const result = patchProfileSchema.safeParse(body)

  const validData = validateOrThrow(result)

  return await patchProfile(
    db,
    tables,
    session.user.id,
    validData
  )
})
