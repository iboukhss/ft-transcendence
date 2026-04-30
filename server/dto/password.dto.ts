import type { DBUser } from '#server/utils/db'

export interface ChangePasswordResponse {
  id: string | number
  updatedAt: string
}

export function toPasswordDTO(user: DBUser | undefined | null): ChangePasswordResponse | null {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    updatedAt: (user.updatedAt instanceof Date ? user.updatedAt : new Date()).toISOString()
  }
}
