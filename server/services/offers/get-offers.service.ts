import { or, eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toOffersResponseDTO } from '#server/dto/offer.dto'

export async function getOffers(db: DB, tables: Tables, userId: number, accountType?: 'freelancer' | 'company' | 'admin') {
  let branchFilter = or(
    eq(tables.offers.buyerId, userId),
    eq(tables.offers.sellerId, userId)
  )

  if (accountType === 'freelancer') {
    branchFilter = eq(tables.offers.sellerId, userId)
  }
  else if (accountType === 'company') {
    branchFilter = eq(tables.offers.buyerId, userId)
  }
  else if (accountType === 'admin') {
    branchFilter = undefined
  }

  const offers = await db.query.offers.findMany({
    where: branchFilter
  })

  if (!offers || offers.length === 0) {
    return []
  }

  return toOffersResponseDTO(offers)
}
