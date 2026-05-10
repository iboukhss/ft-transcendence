// public account information dto

import { z } from 'zod'

import { LANGUAGE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'

export const profileSchema = z.object({
  country: z.enum(COUNTRY_KEYS, 'Please select a country').optional(),
  about: z.string().trim().min(50, 'About me is required').optional(),
  skills: z.enum(SKILL_KEYS).optional(),
  language: z.enum(LANGUAGE_KEYS).optional()
}).strict()

export type ProfileDTO = z.infer<typeof profileSchema>
