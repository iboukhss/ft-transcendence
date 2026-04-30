import type { DBProfile } from '#server/utils/db.js'

export interface ProfileResponseDTO {
  firstName: string
  lastName: string
  houseNumber: number | null
  street: string | null
  zip: string | null
  country: string
  language: string | null
}

export function toProfileResponseDTO(profile: DBProfile): ProfileResponseDTO {
  return {

    firstName: profile.firstName,
    lastName: profile.lastName,
    houseNumber: profile.houseNumber,
    street: profile.street,
    zip: profile.zip,
    country: profile.country,
    language: profile.language
  }
}
