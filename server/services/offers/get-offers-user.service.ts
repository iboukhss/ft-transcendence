import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toOffersResponseDTO } from '#server/dto/offer.dto'
import { throw403 } from '#server/utils/throwError.js'

export async function getOffersUser(
  db: DB,
  tables: Tables,
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
    accountTypeFilter = undefined // Admin darf alles
  }
  else {
    throw403('Invalid accountType')
  }

  const offers = await db.query.offers.findMany({
    where: accountTypeFilter,
    orderBy: (table, { desc }) => [desc(table.createdAt)]
  })

  if (!offers || offers.length === 0) {
    return []
  }

  return toOffersResponseDTO(offers)
}
