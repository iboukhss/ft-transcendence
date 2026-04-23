import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Must provide a valid email address'),
  password: z.string().min(1, 'Password is empty')
})

export type LoginDTO = z.infer<typeof loginSchema>
