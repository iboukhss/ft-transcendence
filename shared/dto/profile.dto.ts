import { z } from 'zod'

import { COUNTRY_KEYS, LANGUAGE_KEYS } from '#shared/constants/enums'

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),

  // NOTE(isma): Ignore warning, if validation breaks try this solution instead:
  // https://github.com/colinhacks/zod/issues/4642#issuecomment-2957508997
  country: z.enum(COUNTRY_KEYS, 'Please select a country'),

  // Unused for now
  houseNumber: z.int().optional(),
  street: z.string().trim().min(1).optional(),
  zip: z.string().trim().min(1).optional(),
  language: z.enum(LANGUAGE_KEYS).optional()
})

export type ProfileDTO = z.infer<typeof profileSchema>
