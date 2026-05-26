import { z } from 'zod'

import { ACCOUNT_TYPE_KEYS, ROLE_KEYS } from '#shared/constants/enums.js'

export const sessionUserSchema = z.object({
  id: z.number(),
  email: z.email(),
  accountType: z.enum(ACCOUNT_TYPE_KEYS),
  role: z.enum(ROLE_KEYS)
})

export type SessionUserDTO = z.infer<typeof sessionUserSchema>
