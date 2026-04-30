import type { DBUser } from '#server/utils/db'

export interface SessionUserDTO {
  id: number
  email: string
  accountType: string
  role: string
}

export function toSessionUserDTO(user: DBUser): SessionUserDTO {
  return {
    id: user.id,
    email: user.email,
    accountType: user.accountType,
    role: user.role
  }
}
