import type { SessionUserDTO } from '#server/dto/user.dto'

declare module '#auth-utils' {
  interface User extends SessionUserDTO {}

  interface UserSession {
    user: User
    loggedInAt?: Date
  }
}

export {}
