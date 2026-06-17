import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

import { db, tables } from '#server/utils/db'
import { offerSchema } from '#shared/dto/offer.dto'

export async function getOffers(userId: number, accountType: 'freelancer' | 'company') {
  const condition = accountType === 'freelancer'
    ? eq(tables.offers.sellerId, userId)
    : eq(tables.offers.buyerId, userId)

  const offers = await db.query.offers.findMany({
    where: condition,
    orderBy: [desc(tables.offers.createdAt)]
  })

  return z.array(offerSchema).parse(offers)
}
