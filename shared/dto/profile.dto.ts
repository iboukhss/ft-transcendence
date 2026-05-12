// public account information dto

import { z } from 'zod'

import { LANGUAGE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  country: z.enum(COUNTRY_KEYS, 'Please select a country').optional(),
  about: z.string().trim().min(50, 'About me is required').nullable().optional(),
  skills: z.array(z.enum(SKILL_KEYS)).nullable().optional(),
  languages: z.array(z.enum(LANGUAGE_KEYS)).nullable().optional()
}).strict()

export type ProfileDTO = z.infer<typeof profileSchema>
