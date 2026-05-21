import { z } from 'zod'

import { BOOKING_STATUS_KEYS, WORKPLACE_KEYS } from '../constants/enums'

const bookingFields = {
  price: z.number().positive(),
  hourlyRate: z.number().positive(),
  duration: z.number().int().min(1),
  workplace: z.enum(WORKPLACE_KEYS).optional(),
  status: z.enum(BOOKING_STATUS_KEYS).default('upcoming')
}

export const insertBookingSchema = z.object({
  ...bookingFields,
  offerId: z.number().int(),
  jobId: z.number().int(),
  buyerId: z.number().int(),
  sellerId: z.number().int()
})

export const updateBookingSchema = z.object(bookingFields).partial().strict()

export type InsertBookingDTO = z.infer<typeof insertBookingSchema>
export type UpdateBookingDTO = z.infer<typeof updateBookingSchema>
