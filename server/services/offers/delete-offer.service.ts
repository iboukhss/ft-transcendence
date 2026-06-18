import { eq, and } from 'drizzle-orm'

import { db, tables } from '#server/utils/db'
import { offerSchema } from '#shared/dto/offer.dto.js'

export async function deleteOffer(offerId: number, userId: number) {
  const [deletedOffer] = await db
    .delete(tables.offers)
    .where(
      and(
        eq(tables.offers.id, offerId),
        eq(tables.offers.sellerId, userId),
        eq(tables.offers.status, 'pending')
      )
    )
    .returning()

  if (!deletedOffer) {
    throw createError({ statusCode: 404, statusMessage: 'Offer not found' })
  }

  return offerSchema.parse(deletedOffer)
}
