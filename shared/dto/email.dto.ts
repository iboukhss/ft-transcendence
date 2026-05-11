import { z } from 'zod'

export const emailSchema = z
  .object({
    email: z.email()
  }).strict()

export type EmailDTO = z.infer<typeof emailSchema>
