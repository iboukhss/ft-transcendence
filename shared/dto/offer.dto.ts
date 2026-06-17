import { z } from 'zod'

import { OFFER_STATUS_KEYS } from '#shared/constants/enums'

export const createOfferSchema = z.object({
  jobId: z.number(),
  motivationLetter: z.string().min(50, 'Must be at least 50 characters'),
  proposedHourlyRate: z.number().positive('Rate must be positive')
})

export const offerSchema = createOfferSchema.extend({
  id: z.number(),
  buyerId: z.number(),
  sellerId: z.number(),
  status: z.enum(OFFER_STATUS_KEYS),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string()
})

export type CreateOfferDTO = z.infer<typeof createOfferSchema>
export type OfferDTO = z.infer<typeof offerSchema>
