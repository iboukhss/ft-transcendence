import type { DBUser } from '#server/utils/db'

export interface ChangeEmailResponseDTO {
  id: string | number
  updatedAt: string
}

export function toEmailDTO(user: DBUser): ChangeEmailResponseDTO {
  return {
    id: user.id,
    updatedAt: (user.updatedAt instanceof Date ? user.updatedAt : new Date()).toISOString()
  }
}
