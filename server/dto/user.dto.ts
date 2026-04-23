import type { InferSelectModel } from 'drizzle-orm'
import type { users } from '#server/database/schema'

type User = InferSelectModel<typeof users>

export function toUserDTO(user: User) {
  return {
    id: user.id,
    email: user.email,
    accountType: user.accountType,
    roleType: user.roleType
  }
}

export type SessionUserDTO = ReturnType<typeof toUserDTO>
