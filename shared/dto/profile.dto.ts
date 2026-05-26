// public account information dto

import { z } from 'zod'

import { LANGUAGE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'

export const freelancerProfileSchema = z.object({
  type: z.literal('freelancer'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  country: z.enum(COUNTRY_KEYS, 'Please select your country'),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  skills: z.array(z.enum(SKILL_KEYS)).default([]),
  languages: z.array(z.enum(LANGUAGE_KEYS)).default([]),
  hourlyRate: z.number().nullable()
})

export const companyProfileSchema = z.object({
  type: z.literal('company'),
  companyName: z.string().min(1, 'Company name required'),
  contactFirstName: z.string().min(1),
  contactLastName: z.string().min(1),
  country: z.enum(COUNTRY_KEYS, 'Please select your country'),
  website: z.url().nullable(),
  logo: z.string().nullable(),
  description: z.string().nullable()
})

export const profileSchema = z.discriminatedUnion('type', [
  freelancerProfileSchema,
  companyProfileSchema
])

export const patchFreelancerSchema = freelancerProfileSchema.partial().extend({
  type: z.literal('freelancer')
})

export const patchCompanySchema = companyProfileSchema.partial().extend({
  type: z.literal('company')
})

export const patchProfileSchema = z.discriminatedUnion('type', [
  patchFreelancerSchema,
  patchCompanySchema
])

export const freelancerIdentitySchema = freelancerProfileSchema.pick({
  type: true,
  firstName: true,
  lastName: true,
  country: true
})

export const companyIdentitySchema = companyProfileSchema.pick({
  type: true,
  contactFirstName: true,
  contactLastName: true,
  companyName: true,
  country: true
})

export const profileIdentitySchema = z.discriminatedUnion('type', [
  freelancerIdentitySchema,
  companyIdentitySchema
])

export type ProfileDTO = z.infer<typeof profileSchema>
export type PatchProfileDTO = z.infer<typeof patchProfileSchema>
export type ProfileIdentityDTO = z.infer<typeof profileIdentitySchema>
