import { z } from 'zod'

import { WORKPLACE_KEYS } from '#shared/constants/enums'

export const createOfferSchema = z.object({
  motivationLetter: z.string().min(50, 'Must be at least 50 characters'),
  proposedHourlyRate: z.number().positive('Counteroffer proposed hourly rate').optional(),
  proposedDuration: z.number().int().min(1, 'Counteroffer proposed duration').optional(),
  proposedWorkplace: z.enum(WORKPLACE_KEYS, 'Counteroffer proposed workplace').optional()
})

export type CreateOfferDTO = z.infer<typeof createOfferSchema>
