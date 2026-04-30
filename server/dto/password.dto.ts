import type { DBUser } from '#server/utils/db'

export interface ChangePasswordResponse {
  id: string | number
  updatedAt: string
}

export function toPasswordDTO(user: DBUser): ChangePasswordResponse {
  return {
    id: user.id,
    updatedAt: (user.updatedAt instanceof Date ? user.updatedAt : new Date()).toISOString()
  }
}
