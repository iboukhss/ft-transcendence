import type { SessionUserDTO } from '#shared/dto/user.dto'

import { updateProfile } from '#server/services/profile/update-profile.service'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'
import { patchProfileSchema } from '#shared/dto/profile.dto'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const body = await readBody(event)
  const result = patchProfileSchema.safeParse(body)
  const validData = validateOrThrow(result)

  if (validData.userId !== session.user.id) {
    throw createError({ statusCode: 403, message: 'Payload authentification spoofing detected.' })
  }

  if (validData.type !== session.user.accountType) {
    throw createError({ statusCode: 403, message: 'Payload authentification spoofing detected.' })
  }

  const updatedProfile = await updateProfile(validData)

  let updatedSessionUser: SessionUserDTO

  if (updatedProfile.type === 'freelancer') {
    updatedSessionUser = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      accountType: session.user.accountType,
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      avatarUrl: updatedProfile.avatar
    }
  }
  else {
    updatedSessionUser = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      accountType: session.user.accountType,
      firstName: updatedProfile.contactFirstName,
      lastName: updatedProfile.contactLastName,
      avatarUrl: updatedProfile.logo
    }
  }

  await setUserSession(event, {
    user: updatedSessionUser
  })

  return updatedProfile
})
