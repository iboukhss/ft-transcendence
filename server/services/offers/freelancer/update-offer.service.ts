import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { OfferDTO } from '#shared/dto/offer.dto'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function updateOffer(db: DB, tables: Tables, userId: number, dto: OfferDTO, jobId: number) {
  const [updatedOffer] = await db
    .update(tables.offers)
    .set({
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      proposedDuraton: dto.proposedDuraton,
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

  if (!updatedOffer) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      statusMessage: 'Offer could not be inserted'
    })
  }

  return toOfferResponseDTO(updatedOffer)
}
