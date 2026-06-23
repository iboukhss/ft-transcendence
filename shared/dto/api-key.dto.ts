import { z } from 'zod'

export const apiKeySchema = z.object({
  userId: z.number(),
  key: z.string().trim().min(1),
  name: z.string().trim().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().nullable().optional()
}).strict()

export type ApiKeyDTO = z.infer<typeof apiKeySchema>
