import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { offerResponseSchema } from '#server/dto/offer.dto'
import { throw403, throw404 } from '#server/utils/throwError.js'

export async function getOfferById(
  db: DB,
  tables: Tables,
  offerId: number,
  userId: number,
  accountType: 'freelancer' | 'company' | 'admin'
) {
  let accountTypeFilter: any = undefined

  if (accountType === 'freelancer') {
    accountTypeFilter = eq(tables.offers.sellerId, userId)
  }
  else if (accountType === 'company') {
    accountTypeFilter = eq(tables.offers.buyerId, userId)
  }
  else if (accountType === 'admin') {
    accountTypeFilter = undefined
  }
  else {
    throw403('Invalid accountType')
  }

  const offer = await db.query.offers.findFirst({
    where: accountTypeFilter
      ? and(eq(tables.offers.id, offerId), accountTypeFilter)
      : eq(tables.offers.id, offerId)
  })

  if (!offer) {
    throw404(`Offer with id "${offerId}" not found or access denied`)
  }

  return offerResponseSchema.parse(offer)
}
