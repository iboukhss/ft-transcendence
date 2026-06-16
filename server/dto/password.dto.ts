// DEPRECATED

import type { DBUser } from '#server/utils/db'

export interface ChangePasswordResponseDTO {
  id: string | number
  updatedAt: string
}

export function toPasswordResponseDTO(user: DBUser): ChangePasswordResponseDTO {
  return {
    id: user.id,
    updatedAt: (user.updatedAt instanceof Date ? user.updatedAt : new Date()).toISOString()
  }
}
