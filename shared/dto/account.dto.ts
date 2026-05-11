// private account information dto

import { z } from 'zod'

export const accountSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  houseNumber: z.int().optional(),
  street: z.string().trim().min(1).optional(),
  zip: z.string().trim().min(1).optional()
}).strict()

export type AccountDTO = z.infer<typeof accountSchema>
