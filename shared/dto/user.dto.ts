import { z } from 'zod'

import { ACCOUNT_TYPE_KEYS, ROLE_KEYS } from '#shared/constants/enums.js'

export const sessionUserSchema = z.object({
  id: z.number(),
  email: z.email(),
  role: z.enum(ROLE_KEYS),
  accountType: z.enum(ACCOUNT_TYPE_KEYS),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable()
})

export type SessionUserDTO = z.infer<typeof sessionUserSchema>
