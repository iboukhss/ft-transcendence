import { patchProfile } from '#server/services/profile/patch-profile.service.js'
import { patchProfileSchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)
  const result = patchProfileSchema.safeParse(body)
  const validData = validateOrThrow(result)

  if (validData.userId !== session.user.id) {
    throw createError({ statusCode: 403, message: 'Payload authentification spoofing detected.' })
  }

  if (validData.type !== session.user.accountType) {
    throw createError({ statusCode: 403, message: 'Payload authentification spoofing detected.' })
  }

  return await patchProfile(validData)
})
