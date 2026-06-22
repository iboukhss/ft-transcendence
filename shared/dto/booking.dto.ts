import { z } from 'zod'

import { BOOKING_STATUS_KEYS, WORKPLACE_KEYS } from '#shared/constants/enums'
import { jobSchema } from '#shared/dto/job.dto.js'
import { companyProfileSchema, freelancerProfileSchema } from '#shared/dto/profile.dto.js'

export const bookingSchema = z.object({
  id: z.number(),
  offerId: z.number(),
  jobId: z.number(),
  buyerId: z.number(),
  sellerId: z.number(),
  price: z.number(),
  hourlyRate: z.number(),
  duration: z.number(),
  status: z.enum(BOOKING_STATUS_KEYS),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string()
})

export const dashboardBookingSchema = bookingSchema.extend({
  job: jobSchema.pick({
    title: true,
    location: true
  }),
  buyer: companyProfileSchema.pick({
    companyName: true
  }),
  seller: freelancerProfileSchema.pick({
    firstName: true,
    lastName: true
  })
})

export type BookingDTO = z.infer<typeof bookingSchema>
export type DashboardBookingDTO = z.infer<typeof dashboardBookingSchema>
