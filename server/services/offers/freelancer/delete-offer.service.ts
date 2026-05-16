import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { OfferDTO } from '#shared/dto/offer.dto'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function deleteOffer(db: DB, tables: Tables, userId: number, dto: OfferDTO, jobId: number) {
  const [deletedOffer] = await db
    .delete(tables.offers)
    .where(
      and(
        eq(tables.offers.id, jobId),
        eq(tables.offers.sellerId, userId)
      )
    )
    .returning()

  if (!deletedOffer) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      statusMessage: 'Offer could not be inserted'
    })
  }

  return toOfferResponseDTO(deletedOffer)
}
