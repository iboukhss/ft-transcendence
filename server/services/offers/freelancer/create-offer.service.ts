import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { OfferDTO } from '#shared/dto/offer.dto'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function createOffer(db: DB, tables: Tables, userId: number, dto: OfferDTO, jobId: number) {
  const job = await db.query.jobs.findFirst({
    where: eq(tables.jobs.id, dto.jobId)
  })

  if (!job) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      statusMessage: 'Job could not be found'
    })
  }

  const [newOffer] = await db
    .insert(tables.offers)
    .values({
      jobId: jobId,
      sellerId: userId,
      buyerId: job.userId,
      status: 'pending',
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      proposedDuraton: dto.proposedDuraton,
      proposedWorkplace: dto.proposedWorkplace,
      createdAt: new Date()
    })
    .returning()

  if (!newOffer) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      statusMessage: 'Offer could not be inserted'
    })
  }

  return toOfferResponseDTO(newOffer)
}
