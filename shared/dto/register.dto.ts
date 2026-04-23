import { z } from 'zod'
import { LANGUAGE_VALUES, COUNTRY_VALUES, ACCOUNT_TYPE_VALUES } from '#shared/constants/enums'

export const registerSchema = z.object({
  accountType: z.enum(ACCOUNT_TYPE_VALUES),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),

  // NOTE(isma): Ignore warning, if validation breaks try this solution instead:
  // https://github.com/colinhacks/zod/issues/4642#issuecomment-2957508997
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.enum(COUNTRY_VALUES, 'Please select a country'),

  // Unused for now
  houseNumber: z.int().optional(),
  street: z.string().trim().min(1).optional(),
  zip: z.string().trim().min(1).optional(),
  language: z.enum(LANGUAGE_VALUES).optional()
})

export type RegisterDTO = z.infer<typeof registerSchema>
