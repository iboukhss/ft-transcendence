import { z } from 'zod'

import { WORKPLACE_KEYS } from '#shared/constants/enums'

export const offerSchema = z.object({
  jobId: z.number().int(),
  motivationLetter: z.string().min(50, 'Explain why you are the ideal candidate'),
  proposedHourlyRate: z.number().positive('Counteroffer proposed hourly rate').optional(),
  proposedDuraton: z.number().int().min(1, 'Counteroffer proposed duration').optional(),
  proposedWorkplace: z.enum(WORKPLACE_KEYS, 'Counteroffer proposed workplace').optional()
}).strict()

export type OfferDTO = z.infer<typeof offerSchema>
