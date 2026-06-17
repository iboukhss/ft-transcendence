import { eq, and } from 'drizzle-orm'

import { db, tables } from '#server/utils/db'
import { offerSchema, type CreateOfferDTO } from '#shared/dto/offer.dto'

export async function createOffer(freelancerId: number, dto: CreateOfferDTO) {
  const job = await db.query.jobs.findFirst({
    where: eq(tables.jobs.id, dto.jobId)
  })

  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Job listing not found' })
  }

  const existingOffer = await db.query.offers.findFirst({
    where: and(
      eq(tables.offers.jobId, dto.jobId),
      eq(tables.offers.sellerId, freelancerId)
    )
  })

  if (existingOffer) {
    throw createError({ statusCode: 409, statusMessage: 'You have already submitted an application for this job' })
  }

  const [newOffer] = await db
    .insert(tables.offers)
    .values({
      jobId: dto.jobId,
      sellerId: freelancerId,
      buyerId: job.userId,
      status: 'pending',
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()

  if (!newOffer) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to submit application' })
  }

  return offerSchema.parse(newOffer)
}
