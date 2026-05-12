// private account information dto

import { z } from 'zod'

export const accountSchema = z.object({
  email: z.email().optional(),
  houseNumber: z.number().int().nullable().optional(),
  street: z.string().trim().min(1).nullable().optional(),
  zip: z.string().trim().min(1).nullable().optional()
}).strict()

export type AccountDTO = z.infer<typeof accountSchema>
