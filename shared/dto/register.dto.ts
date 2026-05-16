import { z } from 'zod'

import { COUNTRY_KEYS } from '#shared/constants/enums'

export const baseRegisterSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password must be at least 8 characters'),
  country: z.enum(COUNTRY_KEYS, 'Please select a country')
})

export const freelancerRegisterSchema = baseRegisterSchema.extend({
  accountType: z.literal('freelancer'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required')
})

export const companyRegisterSchema = baseRegisterSchema.extend({
  accountType: z.literal('company'),
  companyName: z.string().trim().min(1, 'Company name is required')
})

export const registerSchema = z.discriminatedUnion('accountType', [
  freelancerRegisterSchema,
  companyRegisterSchema
])

export type RegisterDTO = z.infer<typeof registerSchema>
