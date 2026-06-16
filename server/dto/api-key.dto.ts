import { z } from 'zod'

export const apiKeysResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  key: z.string().trim().min(1).nullable(),
  name: z.string().trim().min(1).nullable().optional(),
  is_active: z.boolean().optional(),
  expires_at: z.date().nullable().optional(),
  createdAt: z.date().transform(val => val.toISOString()),
  updatedAt: z.date().transform(val => val.toISOString())
})
