// NOTE(isma): DEPRECATED

import type { DBProfile } from '#server/utils/db.js'

export interface ProfileResponseDTO {
  firstName: string
  lastName: string
  country: string
  about: string | null
  skills: string[] | null
  languages: string[] | null

}

export function toProfileResponseDTO(profile: DBProfile): ProfileResponseDTO {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    country: profile.country,
    about: profile.about,
    skills: profile.skills,
    languages: profile.languages
  }
}
