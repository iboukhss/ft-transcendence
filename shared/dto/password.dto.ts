import { z } from 'zod'

export const passwordSchema = z
  .object({
    oldPassword: z.string('Must provide the current password'),
    newPassword: z.string().min(8, 'Must provide the new password'),
    confirmPassword: z.string().min(1, 'Confirm the new password')
  })
  .refine(data => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from the current one',
    path: ['newPassword']
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'The password confirmation must match the new password',
    path: ['confirmPassword']
  })

export type passwordDTO = z.infer<typeof passwordSchema>
