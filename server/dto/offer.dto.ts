import { z } from 'zod'

import type { DBOffer } from '#server/utils/db'

export const offerResponseSchema = z.object({
  id: z.number(),
  jobId: z.number(),
  buyerId: z.number(),
  sellerId: z.number(),
  status: z.string(),
  motivationLetter: z.string(),
  proposedHourlyRate: z.number(),
  sellerAgreed: z.date()
    .nullable()
    .transform(val => val?.toISOString() ?? null),
  buyerAgreed: z.date()
    .nullable()
    .transform(val => val?.toISOString() ?? null),
  sellerDeclined: z.date()
    .nullable()
    .transform(val => val?.toISOString() ?? null),
  buyerDeclined: z.date()
    .nullable()
    .transform(val => val?.toISOString() ?? null),
  createdAt: z.date().transform(val => val.toISOString()),
  updatedAt: z.date().transform(val => val.toISOString())
}).strict()

export type OfferResponseDTO = z.infer<typeof offerResponseSchema>

export function toOffersResponseDTO(offers: DBOffer[]) {
  if (!offers || offers.length === 0) return []
  return offers.map(offer => offerResponseSchema.parse(offer))
}

export function toOfferResponseDTO(offer: DBOffer) {
  return offerResponseSchema.parse(offer)
}
