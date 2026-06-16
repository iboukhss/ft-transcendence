import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { CreateOfferDTO } from '#shared/dto/offer.dto'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function updateOffer(db: DB, tables: Tables, userId: number, dto: CreateOfferDTO, jobId: number) {
  const [updatedOffer] = await db
    .update(tables.offers)
    .set({
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      proposedDuration: dto.proposedDuration,
      proposedWorkplace: dto.proposedWorkplace,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(tables.offers.jobId, jobId),
        eq(tables.offers.sellerId, userId)
      )
    )
    .returning()

  if (!updatedOffer) return throw500('Offer could not be updated')

  return toOfferResponseDTO(updatedOffer)
}
