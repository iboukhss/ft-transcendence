import { z } from 'zod'

import type { DBBooking } from '#server/utils/db'

export const bookingsResponseSchema = z.object({
  id: z.number(),
  offerId: z.number(),
  jobId: z.number(),
  buyerId: z.number(),
  sellerId: z.number(),
  price: z.number(),
  hourlyRate: z.number().nullable(),
  duration: z.number().nullable(),
  workplace: z.string().nullable(),
  status: z.string(),
  createdAt: z.date().transform(val => val.toISOString()),
  updatedAt: z.date().transform(val => val.toISOString())
}).strict()

export type BookingsResponseDTO = z.infer<typeof bookingsResponseSchema>

export function toBookingsResponseDTO(offers: DBBooking[]) {
  if (!offers || offers.length === 0) return []
  return offers.map(offer => bookingsResponseSchema.parse(offer))
}

export function toBookingResponseDTO(offer: DBOffer) {
  return bookingsResponseSchema.parse(offer)
}
