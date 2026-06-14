// public account information dto

import { z } from 'zod'

import { LANGUAGE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'

// Retrieve profile information

export const baseProfileSchema = z.object({
  userId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export const freelancerProfileSchema = baseProfileSchema.extend({
  type: z.literal('freelancer'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  country: z.enum(COUNTRY_KEYS, 'Please select your country'),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  skills: z.array(z.enum(SKILL_KEYS)),
  languages: z.array(z.enum(LANGUAGE_KEYS)),
  hourlyRate: z.number().nullable()
})

export const companyProfileSchema = baseProfileSchema.extend({
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

// Edit profile information

export const patchFreelancerSchema = freelancerProfileSchema
  .omit({ createdAt: true, updatedAt: true, avatar: true })
  .partial()
  .extend({
    userId: z.number(),
    type: z.literal('freelancer')
  })

export const patchCompanySchema = companyProfileSchema
  .omit({ createdAt: true, updatedAt: true, logo: true })
  .partial()
  .extend({
    userId: z.number(),
    type: z.literal('company')
  })

export const patchProfileSchema = z.discriminatedUnion('type', [
  patchFreelancerSchema,
  patchCompanySchema
])

export type ProfileDTO = z.infer<typeof profileSchema>
export type PatchProfileDTO = z.infer<typeof patchProfileSchema>

export type FreelancerDTO = z.infer<typeof freelancerProfileSchema>

// Upload profile picture
// Zod 4 can validate files: https://zod.dev/api?id=files#files

export const AVATAR_MAX_SIZE = 2 * 1024 * 1024
export const AVATAR_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const uploadAvatarSchema = z.object({
  avatar: z.file('Please select an image file')
    .max(AVATAR_MAX_SIZE, 'Image must be less than 2MB')
    .mime(AVATAR_ALLOWED_MIME_TYPES, 'Unsupported image format')
})

export type UploadAvatarDTO = z.infer<typeof uploadAvatarSchema>
