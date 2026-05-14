import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toOffersResponseDTO } from '#server/dto/offer.dto'
import { throw403, throw404 } from '#server/utils/throwError.js'

export async function getOffersJob(
  db: DB,
  tables: Tables,
  jobId: number,
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
    where: accountTypeFilter
      ? and(eq(tables.offers.jobId, jobId), accountTypeFilter)
      : eq(tables.offers.jobId, jobId),
    orderBy: (table, { desc }) => [desc(table.createdAt)]
  })

  if (!offers) {
    throw404(`No offer for job with id "${jobId}" found or access denied`)
  }

  return toOffersResponseDTO(offers)
}
