import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'

import { offerResponseSchema } from '#server/dto/offer.dto.js'
import { throw400, throw403, throw404 } from '#server/utils/throwError.js'

export async function declineOffer(
  db: DB,
  tables: Tables,
  offerId: number,
  userId: number,
  accountType: 'freelancer' | 'company' | 'admin'
) {
  let accountTypeFilter: any = undefined
  if (accountType === 'freelancer') accountTypeFilter = eq(tables.offers.sellerId, userId)
  else if (accountType === 'company') accountTypeFilter = eq(tables.offers.buyerId, userId)
  else if (accountType === 'admin') accountTypeFilter = undefined
  else return throw403('Invalid accountType')

  const finalOffer = await db.transaction(async (tx) => {
    // check current status of the offer
    const currentOffer = await tx.query.offers.findFirst({
      where: eq(tables.offers.id, offerId)
    })

    if (!currentOffer) return throw404('Offer not found')

    // if offer not pending, abort the transaction
    if (currentOffer.status !== 'pending') return throw400('Offer is already accepted or declined')

    // payload with the timestamps for the update
    const updatePayload: any = {
      updatedAt: new Date(),
      status: 'rejected'
    }

    if (accountType === 'freelancer') {
      updatePayload.sellerDeclined = new Date()
      updatePayload.sellerAgreed = null
    }
    else if (accountType === 'company') {
      updatePayload.buyerDeclined = new Date()
      updatePayload.buyerAgreed = null
    }
    else {
      return throw403('Admin cannot decline on behalf')
    }

    const [offer] = await tx
      .update(tables.offers)
      .set(updatePayload)
      .where(
        accountTypeFilter
          ? and(eq(tables.offers.id, offerId), accountTypeFilter)
          : eq(tables.offers.id, offerId)
      )
      .returning()

    if (!offer) return throw404('Offer not found or access denied')

    return offer
  })

  return offerResponseSchema.parse(finalOffer)
}
