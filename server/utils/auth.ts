import { SessionUserDTO } from '#server/dto/user.dto'

type UserSession = {
  user: SessionUserDTO
}

export async function requireUserSession(
  event: any
): Promise<UserSession> {

  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  return session as UserSession
}
