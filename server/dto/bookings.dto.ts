import { z } from 'zod'

import type { DBBooking } from '#server/utils/db'

import { BOOKING_STATUS_KEYS, WORKPLACE_KEYS } from '#shared/constants/enums.js'

export const bookingsResponseSchema = z.object({
  id: z.number(),
  offerId: z.number(),
  jobId: z.number(),
  buyerId: z.number(),
  sellerId: z.number(),
  price: z.number(),
  hourlyRate: z.number(),
  duration: z.number(),
  workplace: z.enum(WORKPLACE_KEYS),
  status: z.enum(BOOKING_STATUS_KEYS),
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
