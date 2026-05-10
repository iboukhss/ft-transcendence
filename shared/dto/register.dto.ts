import { z } from 'zod'

import { ACCOUNT_TYPE_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'

export const registerSchema = z.object({
  accountType: z.enum(ACCOUNT_TYPE_KEYS),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.enum(COUNTRY_KEYS, 'Please select a country')
}).strict()

export type RegisterDTO = z.infer<typeof registerSchema>
