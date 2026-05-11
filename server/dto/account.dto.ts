import type { DBProfile } from '#server/utils/db.js'

export interface AccountResponseDTO {
  firstName: string
  lastName: string
  houseNumber: number | null
  street: string | null
  zip: string | null
}

export function toAccountResponseDTO(profile: DBProfile): AccountResponseDTO {
  return {

    firstName: profile.firstName,
    lastName: profile.lastName,
    houseNumber: profile.houseNumber,
    street: profile.street,
    zip: profile.zip
  }
}
