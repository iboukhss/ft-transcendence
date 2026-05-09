import { z } from 'zod'

export const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.oldPassword !== data.newPassword, {
    message: 'Password must be different from the previous one',
    path: ['newPassword']
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword']
  })

export type PasswordDTO = z.infer<typeof passwordSchema>
