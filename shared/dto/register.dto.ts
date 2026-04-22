import { z } from 'zod'

import { LanguageEnum, CountryEnum, RoleEnum } from '#shared/constants/enums'

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(RoleEnum),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  houseNumber: z.int(),
  street: z.string().trim().min(1),
  zip: z.string().trim().min(1),
  country: z.enum(CountryEnum),
  language: z.enum(LanguageEnum)
})

export type RegisterDTO = z.infer<typeof RegisterSchema>
