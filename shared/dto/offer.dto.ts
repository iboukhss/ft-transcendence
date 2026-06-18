import { z } from 'zod'

import { OFFER_STATUS_KEYS } from '#shared/constants/enums'
import { jobSchema } from '#shared/dto/job.dto.js'
import { freelancerProfileSchema } from '#shared/dto/profile.dto.js'

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

export const dashboardOfferSchema = offerSchema.extend({
  job: jobSchema.pick({
    title: true,
    workplace: true,
    duration: true
  }),
  seller: freelancerProfileSchema.pick({
    firstName: true,
    lastName: true
  })
})

export type CreateOfferDTO = z.infer<typeof createOfferSchema>
export type OfferDTO = z.infer<typeof offerSchema>

export type DashboardOfferDTO = z.infer<typeof dashboardOfferSchema>
