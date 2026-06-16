import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { CreateOfferDTO } from '#shared/dto/offer.dto'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function createOffer(db: DB, tables: Tables, userId: number, dto: CreateOfferDTO, jobId: number) {
  const job = await db.query.jobs.findFirst({
    where: eq(tables.jobs.id, jobId)
  })

  if (!job) return throw404('Job not found')

  const [newOffer] = await db
    .insert(tables.offers)
    .values({
      jobId: jobId,
      sellerId: userId,
      buyerId: job.userId,
      status: 'pending',
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      proposedDuration: dto.proposedDuration,
      proposedWorkplace: dto.proposedWorkplace,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()

  if (!newOffer) return throw500('Offer could not be inserted')

  return toOfferResponseDTO(newOffer)
}
