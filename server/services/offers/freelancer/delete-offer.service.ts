import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function deleteOffer(db: DB, tables: Tables, userId: number, offerId: number) {
  const [deletedOffer] = await db
    .delete(tables.offers)
    .where(
      and(
        eq(tables.offers.id, offerId),
        eq(tables.offers.sellerId, userId)
      )
    )
    .returning()

  if (!deletedOffer) return throw500('Offer could not be deleted')

  return toOfferResponseDTO(deletedOffer)
}
