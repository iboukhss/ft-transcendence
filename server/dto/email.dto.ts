// DEPRECATED

import { z } from 'zod'

export const emailUpdateResponseSchema = z.object({
  id: z.number(),
  updatedAt: z.date().transform(val => val.toISOString())
})

export type EmailUpdateResponseDTO = z.infer<typeof emailUpdateResponseSchema>
