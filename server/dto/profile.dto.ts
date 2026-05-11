import type { DBProfile } from '#server/utils/db.js'

export interface ProfileResponseDTO {
  country: string
  about: string | null
  skills: string[] | null
  language: string | null

}

export function toProfileResponseDTO(profile: DBProfile): ProfileResponseDTO {
  return {
    country: profile.country,
    about: profile.about,
    skills: profile.skills,
    language: profile.language
  }
}
