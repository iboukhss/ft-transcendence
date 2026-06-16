import { z } from 'zod'

export const apiKeySchema = z.object({
  userId: z.number(),
  key: z.string().trim().min(1).nullable(),
  name: z.string().trim().min(1).nullable().optional(),
  is_active: z.boolean().optional(),
  expires_at: z.date().nullable().optional()
}).strict()

export type ApiKeyDTO = z.infer<typeof apiKeySchema>
