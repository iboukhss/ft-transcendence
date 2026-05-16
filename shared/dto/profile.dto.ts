// public account information dto

import { z } from 'zod'

import { LANGUAGE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'

export const freelancerProfileSchema = z.object({
  type: z.literal('freelancer'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  country: z.enum(COUNTRY_KEYS),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  skills: z.array(z.enum(SKILL_KEYS)).default([]),
  languages: z.array(z.enum(LANGUAGE_KEYS)).default([]),
  hourlyRate: z.number().nullable()
})

export const companyProfileSchema = z.object({
  type: z.literal('company'),
  companyName: z.string().min(1),
  country: z.enum(COUNTRY_KEYS),
  website: z.url().nullable(),
  logo: z.string().nullable(),
  description: z.string().nullable()
})

export const profileSchema = z.discriminatedUnion('type', [
  freelancerProfileSchema,
  companyProfileSchema
])

export type ProfileDTO = z.infer<typeof profileSchema>
