import { z } from 'zod'

export const apiKeysResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  key: z.string().trim().min(1),
  name: z.string().trim().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().nullable().optional(),
  createdAt: z.date().transform(val => val.toISOString()),
  updatedAt: z.date().transform(val => val.toISOString())
})
