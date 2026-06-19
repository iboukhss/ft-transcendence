import { z } from 'zod'

export const accountSchema = z.object({
  email: z.email().optional(),
  houseNumber: z.number().int().nullable().optional(),
  street: z.string().trim().min(1).nullable().optional(),
  zip: z.string().trim().min(1).nullable().optional()
}).strict()

export const deleteAccountSchema = z.object({
  confirmText: z.string().refine(val => val === 'DELETE', {
    message: 'Please type DELETE exactly as shown'
  }),
  password: z.string().min(1, 'Password is required')
})

export type AccountDTO = z.infer<typeof accountSchema>

export type DeleteAccountDTO = z.infer<typeof deleteAccountSchema>
