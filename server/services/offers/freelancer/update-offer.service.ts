import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { CreateOfferDTO } from '#shared/dto/offer.dto'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function updateOffer(db: DB, tables: Tables, userId: number, dto: CreateOfferDTO, offerId: number) {
  const [updatedOffer] = await db
    .update(tables.offers)
    .set({
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(tables.offers.id, offerId),        // match by offer ID, not job ID
        eq(tables.offers.sellerId, userId)    // security: must own the offer
      )
    )
    .returning()

  if (!updatedOffer) return throw500('Offer could not be updated')

  return toOfferResponseDTO(updatedOffer)
}
